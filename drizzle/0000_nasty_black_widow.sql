CREATE TABLE `roles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`role` text NOT NULL,
	`updated_at` integer DEFAULT '"2025-06-07T10:52:24.931Z"' NOT NULL,
	`created_at` integer DEFAULT '"2025-06-07T10:52:24.931Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `roles_role_unique` ON `roles` (`role`);--> statement-breakpoint
CREATE TABLE `user_roles` (
	`user_id` integer NOT NULL,
	`role_id` integer NOT NULL,
	`updated_at` integer DEFAULT '"2025-06-07T10:52:24.931Z"' NOT NULL,
	`created_at` integer DEFAULT '"2025-06-07T10:52:24.931Z"' NOT NULL,
	PRIMARY KEY(`user_id`, `role_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`discord_id` text NOT NULL,
	`updated_at` integer DEFAULT '"2025-06-07T10:52:24.931Z"' NOT NULL,
	`created_at` integer DEFAULT '"2025-06-07T10:52:24.931Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_discordId_unique` ON `users` (`discord_id`);--> statement-breakpoint
CREATE TABLE `versions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`version` text NOT NULL,
	`type` text NOT NULL,
	`release_date` integer NOT NULL,
	`imported_date` integer NOT NULL,
	`win_sha` text NOT NULL,
	`linux_sha` text NOT NULL,
	`mac_sha` text NOT NULL,
	`updated_at` integer DEFAULT '"2025-06-07T10:52:24.931Z"' NOT NULL,
	`created_at` integer DEFAULT '"2025-06-07T10:52:24.931Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `versions_version_unique` ON `versions` (`version`);