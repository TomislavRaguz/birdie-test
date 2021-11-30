import { db } from '.';

export async function dbLoader() {
  await db.raw('SELECT 1');
  return () => {
    return db.destroy();
  };
}
