import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { RequestErrorType } from '../../utils/buildRequest.js'
import {
  type GetCacheErrorType,
  getCache,
  withCache,
} from '../../utils/promise/withCache.js'

export type GetBlockHashParameters = {
  /** Time (in ms) that cached block number will remain in memory. */
  cacheTime?: number | undefined
}

export type GetBlockHashReturnType = string

export type GetBlockHashErrorType = RequestErrorType | ErrorType

const cacheKey = (id: string) => `blockNumber.${id}`

/** @internal */
export type GetBlockHashCacheErrorType = GetCacheErrorType | ErrorType

/** @internal */
export function getBlockHashCache(id: string) {
  return getCache(cacheKey(id))
}

export async function getBlockHash<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  { cacheTime = client.cacheTime }: GetBlockHashParameters = {},
): Promise<GetBlockHashReturnType> {
  return withCache(
    () =>
      client.request({
        method: 'mina_blockHash',
      }),
    { cacheKey: cacheKey(client.uid), cacheTime },
  )
}
