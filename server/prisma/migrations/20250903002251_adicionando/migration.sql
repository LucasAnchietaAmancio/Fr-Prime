/*
  Warnings:

  - You are about to alter the column `data_criacao` on the `frete` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `frete` MODIFY `data_criacao` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER';
