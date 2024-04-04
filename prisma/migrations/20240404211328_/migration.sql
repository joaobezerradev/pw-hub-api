/*
  Warnings:

  - A unique constraint covering the columns `[account_id]` on the table `account_profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `account_profile_account_id_key` ON `account_profile`(`account_id`);

INSERT INTO `badge` (`id`,`name`,`description`,`created_at`,`updated_at`) VALUES ('53bdf868-0824-4a95-b6ba-397e5fc7e9c6','ACCOUNT_VERIFIED','A conquista "ACCOUNT_VERIFIED" é concedida aos usuários que completaram com sucesso o processo de verificação de conta em uma plataforma ou serviço. Este marco é um testemunho da autenticidade e confiabilidade da identidade do usuário dentro do sistema.', NOW(3), NOW(3))