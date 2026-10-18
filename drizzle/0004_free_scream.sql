CREATE TABLE `visitor_experiences` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`experience` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `visitor_experiences_created_idx` ON `visitor_experiences` (`created_at`);