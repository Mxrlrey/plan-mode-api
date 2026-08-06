import {Module} from "@nestjs/common";
import {PrismaModule} from "@/prisma/prisma.module";
import {InstallmentPurchaseController} from "@/modules/installments/installment-purchase.controller";
import {InstallmentPurchaseService} from "@/modules/installments/installment-purchase.service";

@Module ({
    imports: [PrismaModule],
    controllers: [InstallmentPurchaseController],
    providers: [InstallmentPurchaseService],
})


export class InstallmentPurchaseModule {}