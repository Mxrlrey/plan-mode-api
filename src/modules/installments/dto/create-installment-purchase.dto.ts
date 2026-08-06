import {IsDateString, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Max, MaxLength} from "class-validator";

export class CreateInstallmentPurchaseDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    description!: string;

    @IsNumber( {maxDecimalPlaces: 2} )
    @IsPositive()
    totalValue!: number;

    @IsInt()
    @IsPositive()
    @Max(99)
    installmentCount!: number;

    @IsDateString()
    firstDueDate!: string;
}