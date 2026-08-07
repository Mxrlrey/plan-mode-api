import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "@/prisma/prisma.service";
import {CreateRecurringTransactionDto} from "@/modules/recurring-transaction/dto/create-recurring-transaction.dto";
import {UpdateRecurringTransactionDto} from "@/modules/recurring-transaction/dto/update-recurring-transaction.dto";

@Injectable()
export class RecurringTransactionService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    findAll(userId: string) {
        return this.prisma.recurringTransaction.findMany({
            where: {
                userId,
            },
            orderBy: {
                startDate: 'desc',
            },
        });
    }

    create(createRecurringTransactionDto: CreateRecurringTransactionDto, userId: string) {
        return this.prisma.recurringTransaction.create({
           data: {
               description: createRecurringTransactionDto.description,
               type: createRecurringTransactionDto.type,
               value: createRecurringTransactionDto.value,
               dayOfMonth: createRecurringTransactionDto.dayOfMonth,
               startDate: new Date(createRecurringTransactionDto.startDate),
               endDate: createRecurringTransactionDto.endDate
                   ? new Date(createRecurringTransactionDto.endDate)
                   : undefined,
               userId
           } ,
        });
    }

    async update(id: string, updateRecurringTransactionDto: UpdateRecurringTransactionDto, userId: string) {
        const recurringTransaction = await this.prisma.recurringTransaction.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!recurringTransaction) {
            throw new NotFoundException('Recurring transaction not found')
        }

        return this.prisma.recurringTransaction.update({
            where: {id},
            data: {
                description: updateRecurringTransactionDto.description,
                type: updateRecurringTransactionDto.type,
                value: updateRecurringTransactionDto.value,
                dayOfMonth: updateRecurringTransactionDto.dayOfMonth,
                startDate: updateRecurringTransactionDto.startDate
                    ? new Date(updateRecurringTransactionDto.startDate)
                    : undefined,
                endDate: updateRecurringTransactionDto.endDate === null
                    ? null
                    : updateRecurringTransactionDto.endDate
                        ? new Date(updateRecurringTransactionDto.endDate)
                        : undefined,
            },
        });
    }

    async remove(id: string, userId: string) {
        const recurringTransaction = await this.prisma.recurringTransaction.findFirst({
            where: {
                id,
                userId
            },
        });

        if (!recurringTransaction) {
            throw new NotFoundException('Recurring transaction not found')
        }

        return this.prisma.recurringTransaction.delete({
            where: {id},
        });
    }
}