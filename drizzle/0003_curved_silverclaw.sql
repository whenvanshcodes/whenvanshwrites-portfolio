CREATE TABLE `portfolio_content` (
	`key` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `project_media` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`object_key` text NOT NULL,
	`mime` text NOT NULL,
	`caption` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `project_media_project_idx` ON `project_media` (`project_id`);