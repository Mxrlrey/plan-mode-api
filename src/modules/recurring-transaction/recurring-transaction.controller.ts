import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards} from "@nestjs/common";
import {RecurringTransactionService} from "@/modules/recurring-transaction/recurring-transaction.service";
import {CurrentUser} from "@/modules/auth/decorators/current-user.decorator";
import {AuthenticatedUser} from "@/modules/auth/types/authenticated-user.interface";
import {CreateRecurringTransactionDto} from "@/modules/recurring-transaction/dto/create-recurring-transaction.dto";
import {UpdateRecurringTransactionDto} from "@/modules/recurring-transaction/dto/update-recurring-transaction.dto";
import {JwtGuard} from "@/modules/auth/guards/jwt.guard";

@UseGuards(JwtGuard)
@Controller('recurring-transactions')
export class RecurringTransactionController {
    constructor(private readonly recurringTransactionService: RecurringTransactionService) {}

    @Get()
    findAll(@CurrentUser() user: AuthenticatedUser) {
        return this.recurringTransactionService.findAll(user.id)
    }

    @Post()
    create(
        @Body() createRecurringTransactionDto: CreateRecurringTransactionDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.recurringTransactionService.create(createRecurringTransactionDto, user.id)
    }

    @Patch(':id')
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() updateRecurringTransactionDto: UpdateRecurringTransactionDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.recurringTransactionService.update(id, updateRecurringTransactionDto, user.id)
    }

    @Delete(':id')
    remove(
        @Param('id', new ParseUUIDPipe()) id: string,
        @CurrentUser() user: AuthenticatedUser
    ) {
        return this.recurringTransactionService.remove(id, user.id)
    }
}