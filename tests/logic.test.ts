import { describe, expect, test } from 'vitest'
import { loadState, STORAGE_KEY } from '../src/client/logic.ts'

describe('persisted state validation', () => {
  test('rejects non-finite merit counts', () => {
    const storage = {
      getItem: (key: string): string | null => key === STORAGE_KEY
        ? JSON.stringify({ count: 1e999 })
        : null,
    }
    expect(loadState(storage, { width: 800, height: 600 }).count).toBe(0)
  })
})
