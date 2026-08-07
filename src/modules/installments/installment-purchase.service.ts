import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "@/prisma/prisma.service";
import {UpdateInstallmentPurchaseDto} from "@/modules/installments/dto/update-installment-purchase.dto";
import {CreateInstallmentPurchaseDto} from "@/modules/installments/dto/create-installment-purchase.dto";

@Injectable()
export class InstallmentPurchaseService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    findAll(userId: string) {
        return this.prisma.installmentPurchase.findMany({
           where: {
               userId,
           },
           orderBy: {
               firstDueDate: 'desc'
           },
        });
    }

    create(createInstallmentPurchaseDto: CreateInstallmentPurchaseDto, userId: string) {
        return this.prisma.installmentPurchase.create({
           data: {
               description: createInstallmentPurchaseDto.description,
               totalValue: createInstallmentPurchaseDto.totalValue,
               installmentCount: createInstallmentPurchaseDto.installmentCount,
               firstDueDate: new Date(createInstallmentPurchaseDto.firstDueDate),
               userId,
           },
        });
    }

    async update(id: string, updateInstallmentPurchaseDto: UpdateInstallmentPurchaseDto, userId: string) {
        const installmentPurchase = await this.prisma.installmentPurchase.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!installmentPurchase) {
            throw new NotFoundException('Installment purchase not found')
        }

        return this.prisma.installmentPurchase.update({
            where: {id},
            data: {
                description: updateInstallmentPurchaseDto.description,
                totalValue: updateInstallmentPurchaseDto.totalValue,
                installmentCount: updateInstallmentPurchaseDto.installmentCount,
                firstDueDate: updateInstallmentPurchaseDto.firstDueDate
                    ? new Date(updateInstallmentPurchaseDto.firstDueDate)
                    : undefined,
            },
        });
    }

    async remove(id: string, userId: string) {
        const installmentPurchase = await this.prisma.installmentPurchase.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!installmentPurchase) {
            throw new NotFoundException('Installment purchase not found')
        }

        return this.prisma.installmentPurchase.delete({
            where: {id},
        });
    }
}