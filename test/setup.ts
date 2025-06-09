import { afterAll, beforeAll, beforeEach, vi } from 'vitest'

import { cleanupCache, listenersCache } from '~vimina/utils/observe.js'
import { promiseCache, responseCache } from '~vimina/utils/promise/withCache.js'
import { socketClientCache } from '~vimina/utils/rpc/socket.js'

import { setErrorConfig } from '../src/errors/base.js'

beforeAll(() => {
  setErrorConfig({
    getDocsUrl({ docsBaseUrl, docsPath }) {
      return docsPath
        ? `${docsBaseUrl ?? 'https://vimina.sh'}${docsPath}`
        : undefined
    },
    version: 'vimina@x.y.z',
  })
  vi.mock('../src/errors/utils.ts', () => ({
    getContractAddress: vi
      .fn()
      .mockReturnValue('0x0000000000000000000000000000000000000000'),
    getUrl: vi.fn().mockReturnValue('http://localhost'),
  }))
})

beforeEach(async () => {
  promiseCache.clear()
  responseCache.clear()
  listenersCache.clear()
  cleanupCache.clear()
  socketClientCache.clear()

  if (process.env.SKIP_GLOBAL_SETUP) return
}, 20_000)

afterAll(async () => {
  vi.restoreAllMocks()

  if (process.env.SKIP_GLOBAL_SETUP) return
})
