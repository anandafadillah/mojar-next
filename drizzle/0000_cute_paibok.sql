CREATE TABLE `api_keys` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`provider` varchar(50) NOT NULL DEFAULT 'gemini',
	`encrypted_key` text NOT NULL,
	`default_model` varchar(100) NOT NULL DEFAULT 'gemini-2.0-flash',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `api_keys_id` PRIMARY KEY(`id`),
	CONSTRAINT `api_keys_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `bank_soals` (
	`id` varchar(36) NOT NULL,
	`modul_ajar_id` varchar(36) NOT NULL,
	`format` varchar(50) NOT NULL,
	`jumlah` int NOT NULL,
	`content` json,
	CONSTRAINT `bank_soals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modul_ajars` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`status` enum('draft','selesai') NOT NULL DEFAULT 'draft',
	`current_step` int NOT NULL DEFAULT 1,
	`form_data` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `modul_ajars_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modul_sections` (
	`id` varchar(36) NOT NULL,
	`modul_ajar_id` varchar(36) NOT NULL,
	`section_key` varchar(100) NOT NULL,
	`content` text,
	`generated_at` timestamp,
	`is_edited` boolean NOT NULL DEFAULT false,
	CONSTRAINT `modul_sections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prompt_templates` (
	`id` varchar(36) NOT NULL,
	`section_key` varchar(100) NOT NULL,
	`template_body` text NOT NULL,
	`model_override` varchar(100),
	`is_active` boolean NOT NULL DEFAULT true,
	`updated_by` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prompt_templates_id` PRIMARY KEY(`id`),
	CONSTRAINT `prompt_templates_section_key_unique` UNIQUE(`section_key`)
);
--> statement-breakpoint
CREATE TABLE `school_settings` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`nama_sekolah` varchar(255),
	`kota` varchar(255),
	`kepala_sekolah` varchar(255),
	`nip_kepsek` varchar(50),
	`tanggal_default` date,
	CONSTRAINT `school_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `school_settings_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`role` enum('admin','guru') NOT NULL DEFAULT 'guru',
	`status` enum('pending','active','inactive') NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `api_keys` ADD CONSTRAINT `api_keys_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bank_soals` ADD CONSTRAINT `bank_soals_modul_ajar_id_modul_ajars_id_fk` FOREIGN KEY (`modul_ajar_id`) REFERENCES `modul_ajars`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `modul_ajars` ADD CONSTRAINT `modul_ajars_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `modul_sections` ADD CONSTRAINT `modul_sections_modul_ajar_id_modul_ajars_id_fk` FOREIGN KEY (`modul_ajar_id`) REFERENCES `modul_ajars`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prompt_templates` ADD CONSTRAINT `prompt_templates_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `school_settings` ADD CONSTRAINT `school_settings_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;