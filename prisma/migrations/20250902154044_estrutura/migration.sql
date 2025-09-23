-- CreateTable
CREATE TABLE `Publicador` (
    `id` VARCHAR(20) NOT NULL,
    `nome_completo` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Frete` (
    `id` VARCHAR(20) NOT NULL,
    `id_empresa` VARCHAR(50) NOT NULL,
    `codigo_frete` VARCHAR(50) NOT NULL,
    `tipo_frete` VARCHAR(50) NOT NULL,
    `tag` TEXT NULL,
    `id_publicador` VARCHAR(191) NOT NULL,
    `produto` VARCHAR(255) NOT NULL,
    `data_criacao` TIMESTAMP NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rota` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_frete` VARCHAR(20) NOT NULL,
    `estado_origem` CHAR(2) NOT NULL,
    `cidade_origem` VARCHAR(100) NOT NULL,
    `estado_destino` CHAR(2) NOT NULL,
    `cidade_destino` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Veiculo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_frete` VARCHAR(20) NOT NULL,
    `nome` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Carroceria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_frete` VARCHAR(20) NOT NULL,
    `nome` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Preco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_frete` VARCHAR(20) NOT NULL,
    `valor` DECIMAL(10, 2) NOT NULL,
    `tipo` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Frete` ADD CONSTRAINT `Frete_id_publicador_fkey` FOREIGN KEY (`id_publicador`) REFERENCES `Publicador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rota` ADD CONSTRAINT `Rota_id_frete_fkey` FOREIGN KEY (`id_frete`) REFERENCES `Frete`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Veiculo` ADD CONSTRAINT `Veiculo_id_frete_fkey` FOREIGN KEY (`id_frete`) REFERENCES `Frete`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Carroceria` ADD CONSTRAINT `Carroceria_id_frete_fkey` FOREIGN KEY (`id_frete`) REFERENCES `Frete`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Preco` ADD CONSTRAINT `Preco_id_frete_fkey` FOREIGN KEY (`id_frete`) REFERENCES `Frete`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
