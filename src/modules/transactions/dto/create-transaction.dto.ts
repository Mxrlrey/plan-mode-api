import {Type} from "class-transformer";
import {IsDateString, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength} from "class-validator";
import {TransactionType} from "@prisma/client";

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