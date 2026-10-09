PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_planned_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_day_id` text NOT NULL,
	`owner_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`sort_order` integer NOT NULL,
	`target_sets` integer,
	`target_rep_min` integer,
	`target_rep_max` integer,
	`target_weight_kg` real,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`workout_day_id`) REFERENCES `workout_days`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "planned_exercises_target_sets" CHECK("__new_planned_exercises"."target_sets" is null or "__new_planned_exercises"."target_sets" >= 1),
	CONSTRAINT "planned_exercises_target_rep_min" CHECK("__new_planned_exercises"."target_rep_min" is null or "__new_planned_exercises"."target_rep_min" >= 1),
	CONSTRAINT "planned_exercises_target_rep_max" CHECK("__new_planned_exercises"."target_rep_max" is null or "__new_planned_exercises"."target_rep_max" >= 1),
	CONSTRAINT "planned_exercises_rep_range" CHECK("__new_planned_exercises"."target_rep_min" is null or "__new_planned_exercises"."target_rep_max" is null or "__new_planned_exercises"."target_rep_max" >= "__new_planned_exercises"."target_rep_min"),
	CONSTRAINT "planned_exercises_target_weight_kg" CHECK("__new_planned_exercises"."target_weight_kg" is null or "__new_planned_exercises"."target_weight_kg" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_planned_exercises`("id", "workout_day_id", "owner_id", "exercise_id", "sort_order", "target_sets", "target_rep_min", "target_rep_max", "target_weight_kg", "created_at", "updated_at", "deleted_at") SELECT "id", "workout_day_id", "owner_id", "exercise_id", "sort_order", "target_sets", "target_rep_min", "target_rep_max", NULL, "created_at", "updated_at", "deleted_at" FROM `planned_exercises`;--> statement-breakpoint
DROP TABLE `planned_exercises`;--> statement-breakpoint
ALTER TABLE `__new_planned_exercises` RENAME TO `planned_exercises`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `planned_exercises_active_exercise` ON `planned_exercises` (`workout_day_id`,`exercise_id`) WHERE "planned_exercises"."deleted_at" is null;