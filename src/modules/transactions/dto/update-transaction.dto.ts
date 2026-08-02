import {Type} from "class-transformer";
import {IsDateString, IsEnum, IsNumber, IsOptional, IsPositive, IsString, MaxLength} from "class-validator";

export enum TransactionType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
}

export class UpdateTransactionDto {
    @IsOptional()
    @IsString()
    @MaxLength(120)
    description?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({maxDecimalPlaces: 2})
    @IsPositive()
    value?: number;

    @IsOptional()
    @IsEnum(TransactionType)
    type?: TransactionType;

    @IsOptional()
    @IsDateString()
    date?: string;
}