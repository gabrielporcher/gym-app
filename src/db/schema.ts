import { sql } from 'drizzle-orm';
import { check, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

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
