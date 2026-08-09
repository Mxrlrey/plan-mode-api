import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards} from "@nestjs/common";
import {CurrentUser} from "@/modules/auth/decorators/current-user.decorator";
import {AuthenticatedUser} from "@/modules/auth/interfaces/authenticated-user.interface";
import {InstallmentPurchaseService} from "@/modules/installments/installment-purchase.service";
import {JwtGuard} from "@/modules/auth/guards/jwt.guard";
import {CreateInstallmentPurchaseDto} from "@/modules/installments/dto/create-installment-purchase.dto";
import {UpdateInstallmentPurchaseDto} from "@/modules/installments/dto/update-installment-purchase.dto";
import {ApiBearerAuth} from "@nestjs/swagger";

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('installment-purchases')
export class InstallmentPurchaseController {
    constructor(private readonly installmentPurchaseService: InstallmentPurchaseService) {}

    @Get()
    findAll(@CurrentUser() user: AuthenticatedUser) {
        return this.installmentPurchaseService.findAll(user.id)
    }

    @Post()
    create(
        @Body() createInstallmentPurchaseDto: CreateInstallmentPurchaseDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.installmentPurchaseService.create(createInstallmentPurchaseDto, user.id)
    }

    @Patch(':id')
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() updateInstallmentPurchaseDto: UpdateInstallmentPurchaseDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.installmentPurchaseService.update(id, updateInstallmentPurchaseDto, user.id)
    }

    @Delete(':id')
    remove(
        @Param('id', new ParseUUIDPipe()) id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.installmentPurchaseService.remove(id, user.id)
    }
}