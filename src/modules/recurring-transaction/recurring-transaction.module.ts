import {Module} from "@nestjs/common";
import {PrismaModule} from "@/prisma/prisma.module";
import {RecurringTransactionController} from "@/modules/recurring-transaction/recurring-transaction.controller";
import {RecurringTransactionService} from "@/modules/recurring-transaction/recurring-transaction.service";

@Module ({
    imports: [PrismaModule],
    controllers: [RecurringTransactionController],
    providers: [RecurringTransactionService]
})

export class RecurringTransactionModule {}