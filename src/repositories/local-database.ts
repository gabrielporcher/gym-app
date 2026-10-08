import { migrate } from 'drizzle-orm/expo-sqlite/migrator';

import { db } from '@/db/client';
import migrations from '@/db/migrations/migrations.js';

export async function prepareLocalDatabase(): Promise<void> {
  await migrate(db, migrations);
}
