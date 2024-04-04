/*
  Warnings:

  - A unique constraint covering the columns `[badge_id,account_profile_id]` on the table `profile_badge` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `profile_badge_badge_id_account_profile_id_key` ON `profile_badge`(`badge_id`, `account_profile_id`);
