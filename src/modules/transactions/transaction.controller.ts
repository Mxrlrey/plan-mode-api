import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards} from "@nestjs/common";
import {CreateTransactionDto} from "@/modules/transactions/dto/create-transaction.dto";
import {UpdateTransactionDto} from "@/modules/transactions/dto/update-transaction.dto";
import { TransactionService } from './transaction.service';
import {JwtGuard} from "@/modules/auth/guards/jwt.guard";
import {CurrentUser} from "@/modules/auth/decorators/current-user.decorator";
import {AuthenticatedUser} from "@/modules/auth/types/authenticated-user.interface";

@UseGuards(JwtGuard)
@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Get()
    findAll(@CurrentUser() user: AuthenticatedUser) {
        return this.transactionService.findAll(user.id);
    }

    @Post()
    create(
        @Body() createTransactionDto: CreateTransactionDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.transactionService.create(createTransactionDto, user.id);
    }

    @Patch(':id')
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() updateTransactionDto: UpdateTransactionDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.transactionService.update(id, updateTransactionDto, user.id);
    }

    @Delete(':id')
    remove(
        @Param('id', new ParseUUIDPipe()) id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.transactionService.remove(id, user.id);
    }
}