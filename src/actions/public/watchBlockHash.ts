import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { HasTransportType } from '../../types/transport.js'
import { getAction } from '../../utils/getAction.js'
import { observe } from '../../utils/observe.js'
import { type PollErrorType, poll } from '../../utils/poll.js'
import { stringify } from '../../utils/stringify.js'

import { type GetBlockHashReturnType, getBlockHash } from './getBlockHash.js'

export type OnBlockHashParameter = GetBlockHashReturnType
export type OnBlockHashFn = (
  blockNumber: OnBlockHashParameter,
  prevBlockHash: OnBlockHashParameter | undefined,
) => void

export type WatchBlockHashParameters<transport extends Transport = Transport> =
  {
    /** The callback to call when a new block number is received. */
    onBlockHash: OnBlockHashFn
    /** The callback to call when an error occurred when trying to get for a new block. */
    onError?: ((error: Error) => void) | undefined
  } & (
    | (HasTransportType<transport, 'webSocket'> extends true
        ? {
            emitMissed?: undefined
            emitOnBegin?: undefined
            /** Whether or not the WebSocket Transport should poll the JSON-RPC, rather than using `mina_subscribe`. */
            poll?: false | undefined
            pollingInterval?: undefined
          }
        : never)
    | {
        /** Whether or not to emit the missed block numbers to the callback. */
        emitMissed?: boolean | undefined
        /** Whether or not to emit the latest block number to the callback when the subscription opens. */
        emitOnBegin?: boolean | undefined
        poll?: true | undefined
        /** Polling frequency (in ms). Defaults to Client's pollingInterval config. */
        pollingInterval?: number | undefined
      }
  )

export type WatchBlockHashReturnType = () => void

export type WatchBlockHashErrorType = PollErrorType | ErrorType

export function watchBlockHash<
  chain extends Chain | undefined,
  transport extends Transport,
>(
  client: Client<transport, chain>,
  {
    emitOnBegin = false,
    emitMissed = false,
    onBlockHash,
    onError,
    poll: poll_,
    pollingInterval = client.pollingInterval,
  }: WatchBlockHashParameters<transport>,
): WatchBlockHashReturnType {
  const enablePolling = (() => {
    if (typeof poll_ !== 'undefined') return poll_
    if (client.transport.type === 'webSocket') return false
    if (
      client.transport.type === 'fallback' &&
      client.transport.transports[0].config.type === 'webSocket'
    )
      return false
    return true
  })()

  let prevBlockHash: GetBlockHashReturnType | undefined

  const pollBlockHash = () => {
    const observerId = stringify([
      'watchBlockHash',
      client.uid,
      emitOnBegin,
      emitMissed,
      pollingInterval,
    ])

    return observe(observerId, { onBlockHash, onError }, (emit) =>
      poll(
        async () => {
          try {
            const blockHash = await getAction(
              client,
              getBlockHash,
              'getBlockHash',
            )({ cacheTime: 0 })

            if (blockHash === prevBlockHash) return

            emit.onBlockHash(blockHash, prevBlockHash)
            prevBlockHash = blockHash
          } catch (err) {
            emit.onError?.(err as Error)
          }
        },
        {
          emitOnBegin,
          interval: pollingInterval,
        },
      ),
    )
  }

  const subscribeBlockHash = () => {
    const observerId = stringify([
      'watchBlockHash',
      client.uid,
      emitOnBegin,
      emitMissed,
    ])

    return observe(observerId, { onBlockHash, onError }, (emit) => {
      let active = true
      let unsubscribe = () => (active = false)
      ;(async () => {
        try {
          const transport = (() => {
            if (client.transport.type === 'fallback') {
              const transport = client.transport.transports.find(
                (transport: ReturnType<Transport>) =>
                  transport.config.type === 'webSocket',
              )
              if (!transport) return client.transport
              return transport.value
            }
            return client.transport
          })()

          const { unsubscribe: unsubscribe_ } = await transport.subscribe({
            params: ['newHeads'],
            onData(data: any) {
              if (!active) return
              const blockHash = data.result
              emit.onBlockHash(blockHash, prevBlockHash)
              prevBlockHash = blockHash
            },
            onError(error: Error) {
              emit.onError?.(error)
            },
          })
          unsubscribe = unsubscribe_
          if (!active) unsubscribe()
        } catch (err) {
          onError?.(err as Error)
        }
      })()
      return () => unsubscribe()
    })
  }

  return enablePolling ? pollBlockHash() : subscribeBlockHash()
}
