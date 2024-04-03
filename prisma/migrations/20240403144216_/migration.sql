-- AlterTable
ALTER TABLE `account` MODIFY `password` VARCHAR(100) NOT NULL;

INSERT INTO `account_token_type` (`id`, `name`, `created_at`, `updated_at`, `deleted_at`) VALUES
('53bdf868-0824-4a95-b6ba-397e5fc7e9c6', 'CONFIRMATION', NOW(3), NOW(3), NULL),
('b94aff8c-54ae-4449-b5e1-8d7c9b3a2823', 'RESET_PASSWORD', NOW(3), NOW(3), NULL),
('ba2e0ad1-b581-4fdd-8e25-74dfcb01811c', 'LOGIN', NOW(3), NOW(3), NULL);