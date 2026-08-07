import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateTransactionDto} from "@/modules/transactions/dto/create-transaction.dto";
import {PrismaService} from "@/prisma/prisma.service";
import {UpdateTransactionDto} from "@/modules/transactions/dto/update-transaction.dto";

@Injectable()
export class TransactionService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    findAll(userId: string) {
        return this.prisma.transaction.findMany({
            where: {
                userId
            },
            orderBy: {
                date: 'desc',
            },
        });
    }

    create(createTransactionDto: CreateTransactionDto, userId: string) {

        return this.prisma.transaction.create({
            data: {
                description: createTransactionDto.description,
                value: createTransactionDto.value,
                type: createTransactionDto.type,
                date: new Date(createTransactionDto.date),
                userId,
            },
        });
    }

    async update(id: string, updateTransactionDto: UpdateTransactionDto, userId:string ) {
        const transaction = await this.prisma.transaction.findFirst({
            where: {
                id,
                userId,
            },
        });

        if(!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        return this.prisma.transaction.update({
            where: {id},
            data: {
                description: updateTransactionDto.description,
                value: updateTransactionDto.value,
                type: updateTransactionDto.type,
                date: updateTransactionDto.date
                    ? new Date(updateTransactionDto.date)
                    : undefined,
            },
        });
    }

    async remove(id: string, userId: string) {
        const transaction = await this.prisma.transaction.findFirst({
            where: {
                id,
                userId,
            },
        });

        if(!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        return this.prisma.transaction.delete({
            where: {id},
        });
    }
}