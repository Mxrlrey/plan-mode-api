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

export class UpdateRecurringTransactionDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    description?: string;

    @IsOptional()
    @IsEnum(TransactionType)
    type?: TransactionType;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({maxDecimalPlaces: 2})
    @IsPositive()
    value?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(31)
    dayOfMonth?: number;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string | null;
}