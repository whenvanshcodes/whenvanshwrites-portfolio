CREATE TABLE `contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`topic` text NOT NULL,
	`message` text NOT NULL,
	`created_at` integer NOT NULL,
	`is_read` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `contacts_created_idx` ON `contacts` (`created_at`);--> statement-breakpoint
CREATE INDEX `contacts_email_idx` ON `contacts` (`email`);--> statement-breakpoint
CREATE TABLE `photo_series` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `photos` (
	`id` text PRIMARY KEY NOT NULL,
	`series_id` text NOT NULL,
	`object_key` text NOT NULL,
	`mime` text NOT NULL,
	`caption` text NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`series_id`) REFERENCES `photo_series`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `photos_series_idx` ON `photos` (`series_id`);