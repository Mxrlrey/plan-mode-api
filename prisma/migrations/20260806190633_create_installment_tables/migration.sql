-- DropIndex
DROP INDEX "RecurringTransaction_userId_idx";

-- CreateTable
CREATE TABLE "InstallmentPurchase" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalValue" DECIMAL(12,2) NOT NULL,
    "installmentCount" INTEGER NOT NULL,
    "firstDueDate" DATE NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstallmentPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Installment" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "dueDate" DATE NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Installment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InstallmentPurchase_userId_firstDueDate_idx" ON "InstallmentPurchase"("userId", "firstDueDate");

-- CreateIndex
CREATE INDEX "Installment_dueDate_idx" ON "Installment"("dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "Installment_purchaseId_number_key" ON "Installment"("purchaseId", "number");

-- AddForeignKey
ALTER TABLE "InstallmentPurchase" ADD CONSTRAINT "InstallmentPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Installment" ADD CONSTRAINT "Installment_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "InstallmentPurchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
