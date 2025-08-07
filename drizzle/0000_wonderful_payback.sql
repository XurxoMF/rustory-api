CREATE TABLE `versions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`version` text NOT NULL,
	`type` text NOT NULL,
	`release_date` integer NOT NULL,
	`imported_date` integer NOT NULL,
	`win_sha` text NOT NULL,
	`linux_sha` text NOT NULL,
	`mac_sha` text NOT NULL,
	`updated_at` integer DEFAULT '"2025-08-07T09:36:50.207Z"' NOT NULL,
	`created_at` integer DEFAULT '"2025-08-07T09:36:50.207Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `versions_version_unique` ON `versions` (`version`);