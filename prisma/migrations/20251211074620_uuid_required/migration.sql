/*
  Warnings:

  - Made the column `uuid` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uuid` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uuid` on table `ProductImage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uuid` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uuid` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Category` MODIFY `uuid` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Product` MODIFY `uuid` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ProductImage` MODIFY `uuid` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ProductVariant` MODIFY `uuid` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `uuid` VARCHAR(191) NOT NULL;
