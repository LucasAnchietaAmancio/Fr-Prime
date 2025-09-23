/*
  Warnings:

  - You are about to alter the column `data_criacao` on the `frete` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `frete` ADD COLUMN `status` VARCHAR(1) NOT NULL DEFAULT 'A',
    MODIFY `data_criacao` TIMESTAMP NOT NULL;
