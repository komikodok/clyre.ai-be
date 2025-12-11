/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `ProductImage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Category` ADD COLUMN `uuid` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `uuid` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ProductImage` ADD COLUMN `uuid` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ProductVariant` ADD COLUMN `uuid` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `uuid` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Category_uuid_key` ON `Category`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `Product_uuid_key` ON `Product`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `ProductImage_uuid_key` ON `ProductImage`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `ProductVariant_uuid_key` ON `ProductVariant`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `User_uuid_key` ON `User`(`uuid`);
