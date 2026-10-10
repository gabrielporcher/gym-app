CREATE TABLE `session_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`owner_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`planned_exercise_id` text,
	`position` integer NOT NULL,
	`target_sets` integer,
	`target_rep_min` integer,
	`target_rep_max` integer,
	`target_weight_kg` real,
	`completed_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`planned_exercise_id`) REFERENCES `planned_exercises`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_exercises_active_exercise` ON `session_exercises` (`session_id`,`exercise_id`) WHERE "session_exercises"."deleted_at" is null;--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`plan_id` text NOT NULL,
	`workout_day_id` text NOT NULL,
	`day_name` text NOT NULL,
	`status` text NOT NULL,
	`started_at` text NOT NULL,
	`completed_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`plan_id`) REFERENCES `workout_plans`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`workout_day_id`) REFERENCES `workout_days`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "sessions_status" CHECK("sessions"."status" in ('in_progress', 'completed'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_one_in_progress_per_owner` ON `sessions` (`owner_id`) WHERE "sessions"."status" = 'in_progress' and "sessions"."deleted_at" is null;--> statement-breakpoint
CREATE TABLE `sets` (
	`id` text PRIMARY KEY NOT NULL,
	`session_exercise_id` text NOT NULL,
	`owner_id` text NOT NULL,
	`position` integer NOT NULL,
	`reps` integer NOT NULL,
	`weight_kg` real NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`session_exercise_id`) REFERENCES `session_exercises`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "sets_reps" CHECK("sets"."reps" >= 1),
	CONSTRAINT "sets_weight_kg" CHECK("sets"."weight_kg" >= 0)
);
