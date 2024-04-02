-- DropForeignKey
ALTER TABLE `community_post` DROP FOREIGN KEY `community_post_community_member_id_fkey`;

-- DropForeignKey
ALTER TABLE `community_member` DROP FOREIGN KEY `community_member_community_role_id_fkey`;
ALTER TABLE `community_member` DROP FOREIGN KEY `community_member_account_id_fkey`;
ALTER TABLE `community_member` DROP FOREIGN KEY `community_member_community_id_fkey`;

-- DropForeignKey
ALTER TABLE `community` DROP FOREIGN KEY `community_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `account_token` DROP FOREIGN KEY `account_token_account_token_type_id_fkey`;
ALTER TABLE `account_token` DROP FOREIGN KEY `account_token_account_id_fkey`;

-- DropForeignKey
ALTER TABLE `profile_badge` DROP FOREIGN KEY `profile_badge_badge_id_fkey`;
ALTER TABLE `profile_badge` DROP FOREIGN KEY `profile_badge_account_profile_id_fkey`;

-- DropForeignKey
ALTER TABLE `account_profile` DROP FOREIGN KEY `account_profile_account_id_fkey`;

-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `account_role_id_fkey`;

-- DropTables
DROP TABLE `community_post`;
DROP TABLE `community_member`;
DROP TABLE `community_role`;
DROP TABLE `community`;
DROP TABLE `account_token_type`;
DROP TABLE `account_token`;
DROP TABLE `profile_badge`;
DROP TABLE `badge`;
DROP TABLE `account_profile`;
DROP TABLE `account_role`;
DROP TABLE `account`;
