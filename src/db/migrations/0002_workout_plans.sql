CREATE TABLE `local_owner` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `planned_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_day_id` text NOT NULL,
	`owner_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`sort_order` integer NOT NULL,
	`target_sets` integer,
	`target_rep_min` integer,
	`target_rep_max` integer,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`workout_day_id`) REFERENCES `workout_days`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "planned_exercises_target_sets" CHECK("planned_exercises"."target_sets" is null or "planned_exercises"."target_sets" >= 1),
	CONSTRAINT "planned_exercises_target_rep_min" CHECK("planned_exercises"."target_rep_min" is null or "planned_exercises"."target_rep_min" >= 1),
	CONSTRAINT "planned_exercises_target_rep_max" CHECK("planned_exercises"."target_rep_max" is null or "planned_exercises"."target_rep_max" >= 1),
	CONSTRAINT "planned_exercises_rep_range" CHECK("planned_exercises"."target_rep_min" is null or "planned_exercises"."target_rep_max" is null or "planned_exercises"."target_rep_max" >= "planned_exercises"."target_rep_min")
);
--> statement-breakpoint
CREATE UNIQUE INDEX `planned_exercises_active_exercise` ON `planned_exercises` (`workout_day_id`,`exercise_id`) WHERE "planned_exercises"."deleted_at" is null;--> statement-breakpoint
CREATE TABLE `workout_day_muscles` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_day_id` text NOT NULL,
	`owner_id` text NOT NULL,
	`muscle_group_id` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`workout_day_id`) REFERENCES `workout_days`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`muscle_group_id`) REFERENCES `muscle_groups`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `workout_day_muscles_active_group` ON `workout_day_muscles` (`workout_day_id`,`muscle_group_id`) WHERE "workout_day_muscles"."deleted_at" is null;--> statement-breakpoint
CREATE TABLE `workout_days` (
	`id` text PRIMARY KEY NOT NULL,
	`plan_id` text NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`weekday` integer NOT NULL,
	`emphasis` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`plan_id`) REFERENCES `workout_plans`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "workout_days_weekday" CHECK("workout_days"."weekday" between 1 and 7),
	CONSTRAINT "workout_days_emphasis" CHECK("workout_days"."emphasis" in ('groups', 'full-body'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `workout_days_active_weekday` ON `workout_days` (`plan_id`,`weekday`) WHERE "workout_days"."deleted_at" is null;--> statement-breakpoint
CREATE TABLE `workout_plans` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`template_id` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	CONSTRAINT "workout_plans_status" CHECK("workout_plans"."status" in ('active', 'archived'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `workout_plans_one_active_per_owner` ON `workout_plans` (`owner_id`) WHERE "workout_plans"."status" = 'active' and "workout_plans"."deleted_at" is null;