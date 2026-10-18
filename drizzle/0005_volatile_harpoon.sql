CREATE TABLE `race_times` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`course` text NOT NULL,
	`reverse` integer NOT NULL,
	`laps` integer NOT NULL,
	`time_ms` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `race_times_course_idx` ON `race_times` (`course`,`reverse`,`laps`,`time_ms`);