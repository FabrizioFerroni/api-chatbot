import { Cache } from 'cache-manager';
import { separateUUIDUser } from './separate-uuid';

export async function invalidateAllCacheKeys(
  cacheManager: Cache,
  key: string,
  usuario_id?: string,
): Promise<void> {
  const keys = await cacheManager.store.keys(
    `${key}${usuario_id ? `_${separateUUIDUser(usuario_id)}` : ''}-*`,
  );

  for (const key_cache of keys) {
    await cacheManager.del(key_cache);
  }
}
