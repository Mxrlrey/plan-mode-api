import {
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Max,
    MaxLength
} from "class-validator";

export class UpdateInstallmentPurchaseDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @MaxLength(120)
    description?: string;

    @IsNumber( {maxDecimalPlaces: 2} )
    @IsOptional()
    @IsPositive()
    totalValue?: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    @Max(99)
    installmentCount?: number;

    @IsDateString()
    @IsOptional()
    firstDueDate?: string;
}