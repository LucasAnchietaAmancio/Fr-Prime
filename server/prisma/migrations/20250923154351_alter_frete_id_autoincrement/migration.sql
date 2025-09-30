/*
  Warnings:

  - You are about to alter the column `id_frete` on the `carroceria` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `Int`.
  - The primary key for the `frete` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `data_criacao` on the `frete` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `id_frete` on the `frete` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `Int`.
  - You are about to alter the column `id_frete` on the `preco` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `Int`.
  - You are about to alter the column `id_frete` on the `rota` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `Int`.
  - You are about to alter the column `id_frete` on the `veiculo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `Int`.
  - Added the required column `id_fretebras` to the `Frete` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `carroceria` DROP FOREIGN KEY `Carroceria_id_frete_fkey`;

-- DropForeignKey
ALTER TABLE `preco` DROP FOREIGN KEY `Preco_id_frete_fkey`;

-- DropForeignKey
ALTER TABLE `rota` DROP FOREIGN KEY `Rota_id_frete_fkey`;

-- DropForeignKey
ALTER TABLE `veiculo` DROP FOREIGN KEY `Veiculo_id_frete_fkey`;

-- DropIndex
DROP INDEX `Carroceria_id_frete_fkey` ON `carroceria`;

-- DropIndex
DROP INDEX `Preco_id_frete_fkey` ON `preco`;

-- DropIndex
DROP INDEX `Rota_id_frete_fkey` ON `rota`;

-- DropIndex
DROP INDEX `Veiculo_id_frete_fkey` ON `veiculo`;

-- AlterTable
ALTER TABLE `carroceria` MODIFY `id_frete` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `frete` DROP PRIMARY KEY,
    ADD COLUMN `id_fretebras` VARCHAR(20) NOT NULL,
    MODIFY `data_criacao` TIMESTAMP NOT NULL,
    MODIFY `id_frete` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_frete`);

-- AlterTable
ALTER TABLE `preco` MODIFY `id_frete` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `rota` MODIFY `id_frete` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `veiculo` MODIFY `id_frete` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Rota` ADD CONSTRAINT `Rota_id_frete_fkey` FOREIGN KEY (`id_frete`) REFERENCES `Frete`(`id_frete`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Veiculo` ADD CONSTRAINT `Veiculo_id_frete_fkey` FOREIGN KEY (`id_frete`) REFERENCES `Frete`(`id_frete`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Carroceria` ADD CONSTRAINT `Carroceria_id_frete_fkey` FOREIGN KEY (`id_frete`) REFERENCES `Frete`(`id_frete`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Preco` ADD CONSTRAINT `Preco_id_frete_fkey` FOREIGN KEY (`id_frete`) REFERENCES `Frete`(`id_frete`) ON DELETE RESTRICT ON UPDATE CASCADE;
