-- CreateTable
CREATE TABLE `account` (
    `id` VARCHAR(36) NOT NULL,
    `username` VARCHAR(15) NOT NULL,
    `password` VARCHAR(30) NOT NULL,
    `email` VARCHAR(30) NOT NULL,
    `email_sent_at` DATETIME(3) NULL,
    `email_confirmed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `last_access_at` DATETIME(3) NOT NULL,
    `is_online` BOOLEAN NOT NULL,

    UNIQUE INDEX `account_username_key`(`username`),
    UNIQUE INDEX `account_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_role` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(20) NOT NULL,
    `is_default` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_profile` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(80) NOT NULL,
    `image_base_64` LONGTEXT NULL,
    `cover_image_base_64` LONGTEXT NULL,
    `about_me` VARCHAR(300) NOT NULL,
    `address` VARCHAR(100) NOT NULL,
    `birthdate` VARCHAR(10) NOT NULL,
    `phone` VARCHAR(15) NOT NULL,
    `account_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `account_profile_account_id_idx`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `badge` (
    `id` VARCHAR(36) NOT NULL,
    `image_base_64` LONGTEXT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(300) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `badge_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile_badge` (
    `id` VARCHAR(36) NOT NULL,
    `account_profile_id` VARCHAR(36) NOT NULL,
    `badge_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_token` (
    `id` VARCHAR(36) NOT NULL,
    `token` VARCHAR(80) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `account_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `account_token_type_id` VARCHAR(36) NOT NULL,

    INDEX `account_token_token_account_id_idx`(`token`, `account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_token_type` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(80) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `community` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(300) NOT NULL,
    `image_base_64` LONGTEXT NULL,
    `cover_image_base_64` LONGTEXT NULL,
    `accountId` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `community_name_key`(`name`),
    INDEX `community_accountId_idx`(`accountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `community_role` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `community_member` (
    `id` VARCHAR(36) NOT NULL,
    `community_id` VARCHAR(36) NOT NULL,
    `account_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `community_role_id` VARCHAR(36) NOT NULL,

    INDEX `community_member_community_id_idx`(`community_id`),
    INDEX `community_member_account_id_idx`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `community_post` (
    `id` VARCHAR(36) NOT NULL,
    `community_member_id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `content` VARCHAR(500) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `account_role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account_profile` ADD CONSTRAINT `account_profile_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_badge` ADD CONSTRAINT `profile_badge_account_profile_id_fkey` FOREIGN KEY (`account_profile_id`) REFERENCES `account_profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_badge` ADD CONSTRAINT `profile_badge_badge_id_fkey` FOREIGN KEY (`badge_id`) REFERENCES `badge`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account_token` ADD CONSTRAINT `account_token_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account_token` ADD CONSTRAINT `account_token_account_token_type_id_fkey` FOREIGN KEY (`account_token_type_id`) REFERENCES `account_token_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `community` ADD CONSTRAINT `community_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `community_member` ADD CONSTRAINT `community_member_community_id_fkey` FOREIGN KEY (`community_id`) REFERENCES `community`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `community_member` ADD CONSTRAINT `community_member_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `community_member` ADD CONSTRAINT `community_member_community_role_id_fkey` FOREIGN KEY (`community_role_id`) REFERENCES `community_role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `community_post` ADD CONSTRAINT `community_post_community_member_id_fkey` FOREIGN KEY (`community_member_id`) REFERENCES `community_member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO `account_role` (`id`, `name`, `is_default`, `created_at`, `updated_at`, `deleted_at`) 
VALUES ('793801b1-49da-45f2-bf38-8b7d379ed874', 'ADMIN', false, NOW(), NOW(), NULL);

INSERT INTO `account_role` (`id`, `name`, `is_default`, `created_at`, `updated_at`, `deleted_at`) 
VALUES ('e669668b-3337-4553-aa5e-bcfad6ebbb15', 'PLAYER', true, NOW(), NOW(), NULL);
