-- AlterTable
ALTER TABLE `Expense` ADD COLUMN `budgetId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Budget` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `month` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_budgetId_fkey` FOREIGN KEY (`budgetId`) REFERENCES `Budget`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
