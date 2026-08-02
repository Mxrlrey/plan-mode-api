import {Type} from "class-transformer";
import {IsDateString, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength} from "class-validator";

export enum TransactionType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
}

export class CreateTransactionDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    description!: string;

    @Type(() => Number)
    @IsNumber({maxDecimalPlaces: 2})
    @IsPositive()
    value!: number;

    @IsEnum(TransactionType)
    type!: TransactionType;

    @IsDateString()
    date!: string;
}