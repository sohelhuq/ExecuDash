'use client';
import { DependencyList, useMemo } from 'react';

type MemoFirebase<T> = T & { __memo?: boolean };

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoized = useMemo(factory, deps);

  if (typeof memoized !== 'object' || memoized === null) {
    return memoized;
  }

  // Use a type assertion to treat memoized as MemoFirebase<T>
  (memoized as MemoFirebase<T>).__memo = true;

  return memoized;
}
