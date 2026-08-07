import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionModule } from './modules/transactions/transaction.module';
import {RecurringTransactionModule} from "@/modules/recurring-transaction/recurring-transaction.module";
import {InstallmentPurchaseModule} from "@/modules/installments/installment-purchase.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    TransactionModule,
    RecurringTransactionModule,
    InstallmentPurchaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
