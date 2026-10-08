import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

const sqlite = openDatabaseSync('gym-training.db');

sqlite.execSync('PRAGMA journal_mode = WAL');

export const db = drizzle(sqlite);
