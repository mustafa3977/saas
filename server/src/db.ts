import { neon, NeonQueryFunction } from '@neondatabase/serverless';

let cachedDb: NeonQueryFunction<false, false> | null = null;

export function getDb(): NeonQueryFunction<false, false> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  if (!cachedDb) {
    cachedDb = neon(connectionString);
  }
  return cachedDb;
}

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const sql = getDb();
  const rows = await sql.query(text, params);
  return rows as T[];
}
