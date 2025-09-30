/*
  Warnings:

  - You are about to alter the column `data_criacao` on the `frete` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - A unique constraint covering the columns `[id_fretebras]` on the table `Frete` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `valorTotal` to the `Frete` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `frete` ADD COLUMN `valorTotal` DECIMAL(10, 2) NOT NULL,
    MODIFY `data_criacao` TIMESTAMP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Frete_id_fretebras_key` ON `Frete`(`id_fretebras`);
