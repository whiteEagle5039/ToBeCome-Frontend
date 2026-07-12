"use client";

import { useEffect, useState } from "react";

/**
 * Persiste une préférence utilisateur dans localStorage (langue,
 * apparence, accessibilité...). Tant qu'il n'y a pas d'endpoint
 * backend dédié, c'est stocké côté navigateur — à migrer vers
 * `updateParentProfile`/une vraie table de préférences plus tard
 * si vous voulez que ça suive le compte sur d'autres appareils.
 */
export function useLocalSetting<T extends string>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) setValue(stored as T);
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }
  }, [key]);

  function update(next: T) {
    setValue(next);
    try {
      window.localStorage.setItem(key, next);
    } catch {
      // ignore
    }
  }

  return { value, setValue: update, hydrated };
}