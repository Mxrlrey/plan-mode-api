import {Body, Controller, Post, UseGuards} from "@nestjs/common";
import {CreateTransactionDto} from "@/modules/transactions/dto/create-transaction.dto";
import { TransactionService } from './transaction.service';
import {JwtGuard} from "@/modules/auth/guards/jwt.guard";
import {CurrentUser} from "@/modules/auth/decorators/current-user.decorator";
import {AuthenticatedUser} from "@/modules/auth/types/authenticated-user.interface";

@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @UseGuards(JwtGuard)
    @Post()
    create(
        @Body() createTransactionDto: CreateTransactionDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.transactionService.create(createTransactionDto, user.id);
    }
}