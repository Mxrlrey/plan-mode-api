import {Injectable} from "@nestjs/common";
import {CreateTransactionDto} from "@/modules/transactions/dto/create-transaction.dto";
import {PrismaService} from "@/prisma/prisma.service";

@Injectable()
export class TransactionService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async create(createTransactionDto: CreateTransactionDto, userId: string) {

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
}