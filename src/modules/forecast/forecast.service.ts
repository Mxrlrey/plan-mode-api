import {Injectable} from "@nestjs/common";
import {ForecastQueryDto} from "@/modules/forecast/dto/forecast-query.dto";
import {PrismaService} from "@/prisma/prisma.service";
import {ForecastEventInterface} from "@/modules/forecast/interfaces/forecast-event.interface";
import {TransactionType} from "@prisma/client";

@Injectable()
export class ForecastService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async generate(forecastQueryDto: ForecastQueryDto, userId: string) {
        const {startDate, endDate} = this.getMonthRange(
              forecastQueryDto.month,
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
                            gte: startDate
                        },
                    },
                ],
            },
        });

        const recurringTransactionEvents: ForecastEventInterface[] = [];

        for (const recurringTransaction of recurringTransactions) {
            const eventDate = this.resolveDayOfMonthDate(
                forecastQueryDto.month,
                recurringTransaction.dayOfMonth,
            )

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
                source: 'RECURRING_TRANSACTION'
            });
        }

        const installments = await this.prisma.installment.findMany({
            where: {
                dueDate: {
                    gte: startDate,
                    lt: endDate,
                },
                purchase: {
                    userId
                },
            },
            include: {
                purchase: true,
            },
            orderBy: {
                dueDate: 'asc'
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

        return events;
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
            endDate
        }
    }

    private resolveDayOfMonthDate (month: string, dayOfMonth: number) {
        const [year, monthNumber] = month.split('-').map(Number);

        const lastDayOfMonth = new Date(
            Date.UTC(year, monthNumber, 0)
        ).getUTCDate();

        const day = Math.min(dayOfMonth, lastDayOfMonth);

        return new Date(
            Date.UTC(year, monthNumber -1, day),
        );
    }
}