CREATE TABLE `visitor_words` (
	`id` text PRIMARY KEY NOT NULL,
	`word` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `visitor_words_created_idx` ON `visitor_words` (`created_at`);