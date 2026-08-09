import {Prisma} from "@prisma/client";

export interface DailyBalanceInterface {
    date: Date,
    balance: Prisma.Decimal;
}