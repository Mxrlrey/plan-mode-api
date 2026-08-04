import {
    IsDateString,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString, Max,
    MaxLength, Min
} from "class-validator";
import {Type} from "class-transformer";
import {TransactionType} from "@prisma/client";

export class CreateRecurringTransactionDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    description!: string;

    @IsEnum(TransactionType)
    type!: TransactionType;

    @Type(() => Number)
    @IsNumber({maxDecimalPlaces: 2})
    @IsPositive()
    value!: number;

    @IsInt()
    @Min(1)
    @Max(31)
    dayOfMonth!: number;

    @IsDateString()
    startDate!: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;
}