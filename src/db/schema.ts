import { sql } from 'drizzle-orm';
import { check, integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const muscleGroups = sqliteTable('muscle_groups', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  sortOrder: integer('sort_order').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  deletedAt: text('deleted_at'),
});

export const muscles = sqliteTable('muscles', {
  id: text('id').primaryKey(),
  muscleGroupId: text('muscle_group_id')
    .notNull()
    .references(() => muscleGroups.id, { onDelete: 'restrict' }),
  name: text('name').notNull(),
  sortOrder: integer('sort_order').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  deletedAt: text('deleted_at'),
});

export const exercises = sqliteTable(
  'exercises',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    equipment: text('equipment', {
      enum: ['barbell', 'ez-bar', 'dumbbell', 'machine', 'cable', 'bodyweight', 'smith', 'trap-bar'],
    }).notNull(),
    loadType: text('load_type', {
      enum: ['barbell', 'dumbbell', 'machine', 'bodyweight', 'cable'],
    }).notNull(),
    kind: text('kind', { enum: ['compound', 'isolation'] }).notNull(),
    unilateral: integer('unilateral', { mode: 'boolean' }).notNull(),
    ownerId: text('owner_id'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
  },
  (table) => [
    uniqueIndex('exercises_base_name_active')
      .on(table.name)
      .where(sql`${table.ownerId} is null and ${table.deletedAt} is null`),
  ],
);

export const exerciseAliases = sqliteTable('exercise_aliases', {
  id: text('id').primaryKey(),
  exerciseId: text('exercise_id')
    .notNull()
    .references(() => exercises.id, { onDelete: 'restrict' }),
  alias: text('alias').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  deletedAt: text('deleted_at'),
});

export const exerciseMuscles = sqliteTable(
  'exercise_muscles',
  {
    id: text('id').primaryKey(),
    exerciseId: text('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'restrict' }),
    muscleId: text('muscle_id')
      .notNull()
      .references(() => muscles.id, { onDelete: 'restrict' }),
    recruitment: integer('recruitment').notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
  },
  (table) => [
    check('exercise_muscles_recruitment_range', sql`${table.recruitment} between 1 and 5`),
    uniqueIndex('exercise_muscles_active_pair')
      .on(table.exerciseId, table.muscleId)
      .where(sql`${table.deletedAt} is null`),
  ],
);

export const localOwner = sqliteTable('local_owner', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  createdAt: text('created_at').notNull(),
});

export const workoutPlans = sqliteTable(
  'workout_plans',
  {
    id: text('id').primaryKey(),
    ownerId: text('owner_id').notNull(),
    name: text('name').notNull(),
    templateId: text('template_id').notNull(),
    status: text('status', { enum: ['active', 'archived'] }).notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
  },
  (table) => [
    check('workout_plans_status', sql`${table.status} in ('active', 'archived')`),
    uniqueIndex('workout_plans_one_active_per_owner')
      .on(table.ownerId)
      .where(sql`${table.status} = 'active' and ${table.deletedAt} is null`),
  ],
);

export const workoutDays = sqliteTable(
  'workout_days',
  {
    id: text('id').primaryKey(),
    planId: text('plan_id')
      .notNull()
      .references(() => workoutPlans.id, { onDelete: 'restrict' }),
    ownerId: text('owner_id').notNull(),
    name: text('name').notNull(),
    weekday: integer('weekday').notNull(),
    emphasis: text('emphasis', { enum: ['groups', 'full-body'] }).notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
  },
  (table) => [
    check('workout_days_weekday', sql`${table.weekday} between 1 and 7`),
    check('workout_days_emphasis', sql`${table.emphasis} in ('groups', 'full-body')`),
    uniqueIndex('workout_days_active_weekday')
      .on(table.planId, table.weekday)
      .where(sql`${table.deletedAt} is null`),
  ],
);

export const workoutDayMuscles = sqliteTable(
  'workout_day_muscles',
  {
    id: text('id').primaryKey(),
    workoutDayId: text('workout_day_id')
      .notNull()
      .references(() => workoutDays.id, { onDelete: 'restrict' }),
    ownerId: text('owner_id').notNull(),
    muscleGroupId: text('muscle_group_id')
      .notNull()
      .references(() => muscleGroups.id, { onDelete: 'restrict' }),
    sortOrder: integer('sort_order').notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
  },
  (table) => [
    uniqueIndex('workout_day_muscles_active_group')
      .on(table.workoutDayId, table.muscleGroupId)
      .where(sql`${table.deletedAt} is null`),
  ],
);

export const plannedExercises = sqliteTable(
  'planned_exercises',
  {
    id: text('id').primaryKey(),
    workoutDayId: text('workout_day_id')
      .notNull()
      .references(() => workoutDays.id, { onDelete: 'restrict' }),
    ownerId: text('owner_id').notNull(),
    exerciseId: text('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'restrict' }),
    sortOrder: integer('sort_order').notNull(),
    targetSets: integer('target_sets'),
    targetRepMin: integer('target_rep_min'),
    targetRepMax: integer('target_rep_max'),
    targetWeightKg: real('target_weight_kg'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
  },
  (table) => [
    check('planned_exercises_target_sets', sql`${table.targetSets} is null or ${table.targetSets} >= 1`),
    check('planned_exercises_target_rep_min', sql`${table.targetRepMin} is null or ${table.targetRepMin} >= 1`),
    check('planned_exercises_target_rep_max', sql`${table.targetRepMax} is null or ${table.targetRepMax} >= 1`),
    check(
      'planned_exercises_rep_range',
      sql`${table.targetRepMin} is null or ${table.targetRepMax} is null or ${table.targetRepMax} >= ${table.targetRepMin}`,
    ),
    check(
      'planned_exercises_target_weight_kg',
      sql`${table.targetWeightKg} is null or ${table.targetWeightKg} > 0`,
    ),
    uniqueIndex('planned_exercises_active_exercise')
      .on(table.workoutDayId, table.exerciseId)
      .where(sql`${table.deletedAt} is null`),
  ],
);

export const sessions = sqliteTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    ownerId: text('owner_id').notNull(),
    planId: text('plan_id')
      .notNull()
      .references(() => workoutPlans.id, { onDelete: 'restrict' }),
    workoutDayId: text('workout_day_id')
      .notNull()
      .references(() => workoutDays.id, { onDelete: 'restrict' }),
    dayName: text('day_name').notNull(),
    status: text('status', { enum: ['in_progress', 'completed'] }).notNull(),
    startedAt: text('started_at').notNull(),
    completedAt: text('completed_at'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
  },
  (table) => [
    check('sessions_status', sql`${table.status} in ('in_progress', 'completed')`),
    uniqueIndex('sessions_one_in_progress_per_owner')
      .on(table.ownerId)
      .where(sql`${table.status} = 'in_progress' and ${table.deletedAt} is null`),
  ],
);

export const sessionExercises = sqliteTable(
  'session_exercises',
  {
    id: text('id').primaryKey(),
    sessionId: text('session_id')
      .notNull()
      .references(() => sessions.id, { onDelete: 'restrict' }),
    ownerId: text('owner_id').notNull(),
    exerciseId: text('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'restrict' }),
    plannedExerciseId: text('planned_exercise_id').references(() => plannedExercises.id, { onDelete: 'restrict' }),
    position: integer('position').notNull(),
    targetSets: integer('target_sets'),
    targetRepMin: integer('target_rep_min'),
    targetRepMax: integer('target_rep_max'),
    targetWeightKg: real('target_weight_kg'),
    completedAt: text('completed_at'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
  },
  (table) => [
    uniqueIndex('session_exercises_active_exercise')
      .on(table.sessionId, table.exerciseId)
      .where(sql`${table.deletedAt} is null`),
  ],
);

export const sets = sqliteTable(
  'sets',
  {
    id: text('id').primaryKey(),
    sessionExerciseId: text('session_exercise_id')
      .notNull()
      .references(() => sessionExercises.id, { onDelete: 'restrict' }),
    ownerId: text('owner_id').notNull(),
    position: integer('position').notNull(),
    reps: integer('reps').notNull(),
    weightKg: real('weight_kg').notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
  },
  (table) => [
    check('sets_reps', sql`${table.reps} >= 1`),
    check('sets_weight_kg', sql`${table.weightKg} >= 0`),
  ],
);
