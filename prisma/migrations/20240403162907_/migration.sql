/*
  Warnings:

  - You are about to drop the column `token` on the `account_token` table. All the data in the column will be lost.
  - Added the required column `code` to the `account_token` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `account_token_token_account_id_idx` ON `account_token`;

-- AlterTable
ALTER TABLE `account_token` DROP COLUMN `token`,
    ADD COLUMN `code` VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE INDEX `account_token_code_account_id_account_token_type_id_idx` ON `account_token`(`code`, `account_id`, `account_token_type_id`);
