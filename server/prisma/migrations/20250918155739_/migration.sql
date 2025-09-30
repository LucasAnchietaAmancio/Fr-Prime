/*
  Warnings:

  - You are about to alter the column `data_criacao` on the `frete` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Added the required column `cpf` to the `Publicador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Publicador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `Publicador` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `frete` MODIFY `data_criacao` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `publicador` ADD COLUMN `cpf` VARCHAR(14) NOT NULL,
    ADD COLUMN `email` VARCHAR(255) NOT NULL,
    ADD COLUMN `telefone` VARCHAR(15) NOT NULL;
