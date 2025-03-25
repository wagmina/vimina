import { RpcRequestError } from '../../errors/request.js'
import {
  UrlRequiredError,
  type UrlRequiredErrorType,
} from '../../errors/transport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { RpcRequest, RpcResponse } from '../../types/rpc.js'

import {
  type KlesiaRpcRequestType,
  handleJsonRpcRequest,
} from '@mina-js/klesia-utils'
import {
  type CreateTransportErrorType,
  type Transport,
  type TransportConfig,
  createTransport,
} from './createTransport.js'

export type HttpTransportConfig = {
  /** The key of the HTTP transport. */
  key?: TransportConfig['key'] | undefined
  /** The name of the HTTP transport. */
  name?: TransportConfig['name'] | undefined
  /** The max number of times to retry. */
  retryCount?: TransportConfig['retryCount'] | undefined
  /** The base delay (in ms) between retries. */
  retryDelay?: TransportConfig['retryDelay'] | undefined
  /** The timeout (in ms) for the HTTP request. Default: 10_000 */
  timeout?: TransportConfig['timeout'] | undefined
}

export type HttpTransport = Transport<
  'http',
  {
    url?: string | undefined
  }
>

export type HttpTransportErrorType =
  | CreateTransportErrorType
  | UrlRequiredErrorType
  | ErrorType

/**
 * @description Creates a HTTP transport that connects to a GraphQL API.
 */
export function http(
  /** URL of the GraphQL API. Defaults to the chain's public RPC URL. */
  url?: string | undefined,
  config: HttpTransportConfig = {},
): HttpTransport {
  const { key = 'http', name = 'HTTP GraphQL', retryDelay } = config
  return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
    const retryCount = config.retryCount ?? retryCount_
    const timeout = timeout_ ?? config.timeout ?? 10_000
    const url_ = url || chain?.rpcUrls.default.http[0]
    if (!url_) throw new UrlRequiredError()

    return createTransport(
      {
        key,
        name,
        async request({ method, params }) {
          const body = { method, params }

          const fn = async (body: RpcRequest) => [
            (await handleJsonRpcRequest(
              url_,
              body as KlesiaRpcRequestType,
            )) as RpcResponse,
          ]

          const [{ error, result }] = await fn(body)
          if (error)
            throw new RpcRequestError({
              body,
              error,
              url: url_,
            })
          return result
        },
        retryCount,
        retryDelay,
        timeout,
        type: 'http',
      },
      {
        url: url_,
      },
    )
  }
}
