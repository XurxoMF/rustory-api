PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_versions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`version` text NOT NULL,
	`type` text NOT NULL,
	`release_date` integer NOT NULL,
	`imported_date` integer NOT NULL,
	`win_sha` text NOT NULL,
	`linux_sha` text NOT NULL,
	`mac_x_64_sha` text NOT NULL,
	`mac_arm64_sha` text NOT NULL,
	`updated_at` integer DEFAULT '"2026-06-11T15:06:42.249Z"' NOT NULL,
	`created_at` integer DEFAULT '"2026-06-11T15:06:42.249Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_versions`("id", "version", "type", "release_date", "imported_date", "win_sha", "linux_sha", "mac_x_64_sha", "mac_arm64_sha", "updated_at", "created_at") SELECT "id", "version", "type", "release_date", "imported_date", "win_sha", "linux_sha", "mac_sha", "mac_sha", "updated_at", "created_at" FROM `versions`;--> statement-breakpoint
DROP TABLE `versions`;--> statement-breakpoint
ALTER TABLE `__new_versions` RENAME TO `versions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `versions_version_unique` ON `versions` (`version`);