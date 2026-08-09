import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "@/prisma/prisma.service";
import {UpdateInstallmentPurchaseDto} from "@/modules/installments/dto/update-installment-purchase.dto";
import {CreateInstallmentPurchaseDto} from "@/modules/installments/dto/create-installment-purchase.dto";
import {Prisma} from "@prisma/client";

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
        const total = new Prisma.Decimal(createInstallmentPurchaseDto.totalValue);

        const installmentValue = total
            .div(createInstallmentPurchaseDto.installmentCount)
            .toDecimalPlaces(2, Prisma.Decimal.ROUND_DOWN);

        const distributedValue = installmentValue.mul(
            createInstallmentPurchaseDto.installmentCount - 1,
        );

        const lastInstallmentValue = total.sub(
            distributedValue,
        );

        const firstDueDateObject = new Date(createInstallmentPurchaseDto.firstDueDate);

        const installments = [];

        for (let installment = 0; installment < createInstallmentPurchaseDto.installmentCount; installment++) {
            const number = installment + 1;

            const value =
                installment === createInstallmentPurchaseDto.installmentCount - 1
                    ? lastInstallmentValue
                    : installmentValue;

            const year = firstDueDateObject.getUTCFullYear();
            const month = firstDueDateObject.getUTCMonth() + installment;
            const originalDay = firstDueDateObject.getUTCDate();

            const lastDayOfTargetMonth = new Date(
                Date.UTC(year, month + 1, 0),
            ).getUTCDate();

            const day = Math.min(
                originalDay,
                lastDayOfTargetMonth,
            );

            const dueDate = new Date(
                Date.UTC(year, month, day),
            );

            installments.push({
                number,
                value,
                dueDate,
            });
        }

        return this.prisma.installmentPurchase.create({
            data: {
                description: createInstallmentPurchaseDto.description,
                totalValue: createInstallmentPurchaseDto.totalValue,
                installmentCount: createInstallmentPurchaseDto.installmentCount,
                firstDueDate: firstDueDateObject,
                userId,

                installments: {
                    create: installments,
                },
            },
            include: {
                installments: true,
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

        const shouldRecalculateInstallments =
            updateInstallmentPurchaseDto.totalValue !== undefined
            || updateInstallmentPurchaseDto.installmentCount !== undefined
            || updateInstallmentPurchaseDto.firstDueDate !== undefined;

        let installments;

        if (shouldRecalculateInstallments) {
            const installmentCount = updateInstallmentPurchaseDto.installmentCount ?? installmentPurchase.installmentCount;
            const firstDueDate = updateInstallmentPurchaseDto.firstDueDate
                ? new Date(updateInstallmentPurchaseDto.firstDueDate)
                : installmentPurchase.firstDueDate;

            const total =
                updateInstallmentPurchaseDto.totalValue !== undefined
                    ? new Prisma.Decimal(updateInstallmentPurchaseDto.totalValue)
                    : installmentPurchase.totalValue;

            const installmentValue = total
                .div(installmentCount)
                .toDecimalPlaces(2, Prisma.Decimal.ROUND_DOWN);

            const distributedValue = installmentValue.mul(
                installmentCount - 1,
            );

            const lastInstallmentValue = total.sub(
                distributedValue,
            );

            installments = [];

            for (let installment = 0; installment < installmentCount; installment++) {
                const number = installment + 1;

                const value =
                    installment === installmentCount - 1
                        ? lastInstallmentValue
                        : installmentValue;

                const year = firstDueDate.getUTCFullYear();
                const month = firstDueDate.getUTCMonth() + installment;
                const originalDay = firstDueDate.getUTCDate();

                const lastDayOfTargetMonth = new Date(
                    Date.UTC(year, month + 1, 0),
                ).getUTCDate();

                const day = Math.min(
                    originalDay,
                    lastDayOfTargetMonth,
                );

                const dueDate = new Date(
                    Date.UTC(year, month, day),
                );

                installments.push({
                    number,
                    value,
                    dueDate,
                });
            }
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
                ...(shouldRecalculateInstallments && installments && {
                    installments: {
                        deleteMany: {},
                        create: installments,
                    },
                }),
            },
            include: {
                installments: true,
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