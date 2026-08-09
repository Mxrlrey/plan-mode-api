import {Injectable} from "@nestjs/common";
import {ForecastQueryDto} from "@/modules/forecast/dto/forecast-query.dto";
import {PrismaService} from "@/prisma/prisma.service";
import {ForecastEventInterface} from "@/modules/forecast/interfaces/forecast-event.interface";
import {Prisma, TransactionType} from "@prisma/client";
import {DailyBalanceInterface} from "@/modules/forecast/interfaces/daily-balance.interface";

@Injectable()
export class ForecastService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async generate(forecastQueryDto: ForecastQueryDto, userId: string) {
        const {startDate, endDate} = this.getMonthRange(
            forecastQueryDto.month,
        );

        const initialBalance = await this.calculateInitialBalance(
            userId,
            startDate,
        );

        const transactions = await this.prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lt: endDate,
                },
            },
            orderBy: {
                date: 'asc',
            },
        });

        const transactionEvents: ForecastEventInterface[] = transactions.map((transaction) => ({
            id: transaction.id,
            description: transaction.description,
            type: transaction.type,
            value: transaction.value,
            date: transaction.date,
            source: 'TRANSACTION',
        }));

        const recurringTransactions = await this.prisma.recurringTransaction.findMany({
            where: {
                userId,
                startDate: {
                    lt: endDate,
                },
                OR: [
                    {
                        endDate: null,
                    },
                    {
                        endDate: {
                            gte: startDate,
                        },
                    },
                ],
            },
        });

        const recurringTransactionEvents: ForecastEventInterface[] = [];

        const [year, monthNumber] = forecastQueryDto.month
            .split('-')
            .map(Number);

        for (const recurringTransaction of recurringTransactions) {
            const eventDate = this.resolveDayOfMonthDate(
                year,
                monthNumber - 1,
                recurringTransaction.dayOfMonth,
            );

            if (eventDate < recurringTransaction.startDate) {
                continue;
            }

            if (recurringTransaction.endDate && eventDate > recurringTransaction.endDate) {
                continue;
            }

            recurringTransactionEvents.push({
                id: recurringTransaction.id,
                description: recurringTransaction.description,
                type: recurringTransaction.type,
                value: recurringTransaction.value,
                date: eventDate,
                source: 'RECURRING_TRANSACTION',
            });
        }

        const installments = await this.prisma.installment.findMany({
            where: {
                dueDate: {
                    gte: startDate,
                    lt: endDate,
                },
                purchase: {
                    userId,
                },
            },
            include: {
                purchase: true,
            },
            orderBy: {
                dueDate: 'asc',
            },
        });

        const installmentEvents: ForecastEventInterface[] = installments.map((installment) => ({
            id: installment.id,
            description:
                `${installment.purchase.description} ` +
                `(${installment.number}/${installment.purchase.installmentCount})`,
            type: TransactionType.EXPENSE,
            value: installment.value,
            date: installment.dueDate,
            source: 'INSTALLMENT',
        }));

        const events: ForecastEventInterface[] = [
            ...transactionEvents,
            ...recurringTransactionEvents,
            ...installmentEvents,
        ];

        events.sort(
            (a, b) => a.date.getTime() - b.date.getTime(),
        );

        const balances = this.calculateBalances(
            initialBalance,
            events,
            startDate,
            endDate,
        );

        return {
            initialBalance,
            finalBalance: balances.finalBalance,
            dailyBalances: balances.dailyBalances,
            events,
        };
    }

    private getMonthRange(month: string) {
        const [year, monthNumber] = month.split('-').map(Number);

        const startDate = new Date(
            Date.UTC(year, monthNumber -1, 1),
        );

        const endDate = new Date(
            Date.UTC(year, monthNumber, 1),
        );

        return {
            startDate,
            endDate,
        };
    }

    private resolveDayOfMonthDate(year: number, month: number, dayOfMonth: number) {
        const lastDayOfMonth = new Date(
            Date.UTC(year, month + 1, 0),
        ).getUTCDate();

        const day = Math.min(dayOfMonth, lastDayOfMonth);

        return new Date(
            Date.UTC(year, month, day),
        );
    }

    private async calculateInitialBalance(userId: string, beforeDate: Date): Promise<Prisma.Decimal> {
        let balance = new Prisma.Decimal(0);

        const transactions = await this.prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    lt: beforeDate,
                },
            },
        });

        for (const transaction of transactions) {
            if (transaction.type === TransactionType.INCOME) {
                balance = balance.add(transaction.value);
            } else {
                balance = balance.sub(transaction.value);
            }
        }

        const recurringTransactions = await this.prisma.recurringTransaction.findMany({
            where: {
                userId,
                startDate: {
                    lt: beforeDate,
                },
            },
        });

        for (const recurringTransaction of recurringTransactions) {
            let currentMonth = new Date(
                Date.UTC(
                    recurringTransaction.startDate.getUTCFullYear(),
                    recurringTransaction.startDate.getUTCMonth(),
                    1,
                ),
            );

            while (currentMonth < beforeDate) {
                const eventDate = this.resolveDayOfMonthDate(
                    currentMonth.getUTCFullYear(),
                    currentMonth.getUTCMonth(),
                    recurringTransaction.dayOfMonth,
                );

                const isValidOccurrence =
                    eventDate >= recurringTransaction.startDate &&
                    (!recurringTransaction.endDate || eventDate <= recurringTransaction.endDate);

                if (isValidOccurrence) {
                    if (recurringTransaction.type === TransactionType.INCOME) {
                        balance = balance.add(recurringTransaction.value);
                    } else {
                        balance = balance.sub(recurringTransaction.value);
                    }
                }

                currentMonth = new Date(
                    Date.UTC(
                        currentMonth.getUTCFullYear(),
                        currentMonth.getUTCMonth() + 1,
                        1,
                    ),
                );
            }
        }

        const installments = await this.prisma.installment.findMany({
            where: {
                dueDate: {
                    lt: beforeDate,
                },
                purchase: {
                    userId,
                },
            },
        });

        for (const installment of installments) {
            balance = balance.sub(installment.value);
        }

        return balance;
    }

    private calculateBalances(initialBalance: Prisma.Decimal, events: ForecastEventInterface[], startDate: Date, endDate: Date) {
        let balance = initialBalance;
        const dailyBalances: DailyBalanceInterface[] = [];
        let currentDate = new Date(startDate);
        let eventIndex = 0;

        while (currentDate < endDate) {
            while (
                eventIndex < events.length &&
                events[eventIndex].date.getUTCFullYear() === currentDate.getUTCFullYear() &&
                events[eventIndex].date.getUTCMonth() === currentDate.getUTCMonth() &&
                events[eventIndex].date.getUTCDate() === currentDate.getUTCDate()
            ) {
                const eventOfDay = events[eventIndex];

                if (eventOfDay.type === TransactionType.INCOME) {
                    balance = balance.add(eventOfDay.value);
                } else {
                    balance = balance.sub(eventOfDay.value);
                }

                eventIndex++;
            }

            dailyBalances.push({
                date: new Date(currentDate),
                balance,
            });

            currentDate = new Date(
                Date.UTC(
                    currentDate.getUTCFullYear(),
                    currentDate.getUTCMonth(),
                    currentDate.getUTCDate() + 1,
                ),
            );
        }

        return {
            dailyBalances,
            finalBalance: balance,
        };
    }
}
