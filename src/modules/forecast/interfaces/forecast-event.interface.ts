import {Prisma, TransactionType} from "@prisma/client";

export interface ForecastEventInterface {
    id: string;
    description: string;
    type: TransactionType;
    value: Prisma.Decimal;
    date: Date;
    source: 'TRANSACTION' | 'RECURRING_TRANSACTION' | 'INSTALLMENT';
}