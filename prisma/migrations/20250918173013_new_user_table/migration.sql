/*
  Warnings:

  - You are about to alter the column `id_publicador` on the `frete` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `data_criacao` on the `frete` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - The primary key for the `usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `nome` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the `publicador` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cpf` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome_completo` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `frete` DROP FOREIGN KEY `Frete_id_publicador_fkey`;

-- DropIndex
DROP INDEX `Frete_id_publicador_fkey` ON `frete`;

-- AlterTable
ALTER TABLE `frete` MODIFY `id_publicador` VARCHAR(20) NOT NULL,
    MODIFY `data_criacao` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `usuario` DROP PRIMARY KEY,
    DROP COLUMN `nome`,
    ADD COLUMN `cpf` VARCHAR(14) NOT NULL,
    ADD COLUMN `nome_completo` VARCHAR(255) NOT NULL,
    ADD COLUMN `telefone` VARCHAR(15) NOT NULL,
    MODIFY `id` VARCHAR(20) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `publicador`;

-- AddForeignKey
ALTER TABLE `Frete` ADD CONSTRAINT `Frete_id_publicador_fkey` FOREIGN KEY (`id_publicador`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
