/*
  Warnings:

  - You are about to alter the column `data_criacao` on the `frete` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the column `nome_completo` on the `usuario` table. All the data in the column will be lost.
  - Added the required column `nome` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `frete` MODIFY `data_criacao` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `nome_completo`,
    ADD COLUMN `nome` VARCHAR(255) NOT NULL;
