CREATE TABLE `exercise_aliases` (
	`id` text PRIMARY KEY NOT NULL,
	`exercise_id` text NOT NULL,
	`alias` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `exercise_muscles` (
	`id` text PRIMARY KEY NOT NULL,
	`exercise_id` text NOT NULL,
	`muscle_id` text NOT NULL,
	`recruitment` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`muscle_id`) REFERENCES `muscles`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "exercise_muscles_recruitment_range" CHECK("exercise_muscles"."recruitment" between 1 and 5)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercise_muscles_active_pair` ON `exercise_muscles` (`exercise_id`,`muscle_id`) WHERE "exercise_muscles"."deleted_at" is null;--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`equipment` text NOT NULL,
	`load_type` text NOT NULL,
	`kind` text NOT NULL,
	`unilateral` integer NOT NULL,
	`owner_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercises_base_name_active` ON `exercises` (`name`) WHERE "exercises"."owner_id" is null and "exercises"."deleted_at" is null;--> statement-breakpoint
CREATE TABLE `muscle_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `muscles` (
	`id` text PRIMARY KEY NOT NULL,
	`muscle_group_id` text NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`muscle_group_id`) REFERENCES `muscle_groups`(`id`) ON UPDATE no action ON DELETE restrict
);
