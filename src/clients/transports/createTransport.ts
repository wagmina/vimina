import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { JSAPIStandardRequestFn } from '../../types/jsApiStandard.js'
import { buildRequest } from '../../utils/buildRequest.js'
import { uid as uid_ } from '../../utils/uid.js'
import type { ClientConfig } from '../createClient.js'

export type TransportConfig<
  type extends string = string,
  jsApiStandardRequestFn extends
    JSAPIStandardRequestFn = JSAPIStandardRequestFn,
> = {
  /** The name of the transport. */
  name: string
  /** The key of the transport. */
  key: string
  /** The JSON-RPC request function that matches the [JavaScriptAPIStandard] request spec. */
  request: jsApiStandardRequestFn
  /** The base delay (in ms) between retries. */
  retryDelay?: number | undefined
  /** The max number of times to retry. */
  retryCount?: number | undefined
  /** The timeout (in ms) for requests. */
  timeout?: number | undefined
  /** The type of the transport. */
  type: type
}

export type Transport<
  type extends string = string,
  rpcAttributes = Record<string, any>,
  jsApiStandardRequestFn extends
    JSAPIStandardRequestFn = JSAPIStandardRequestFn,
> = <chain extends Chain | undefined = Chain>({
  chain,
}: {
  chain?: chain | undefined
  pollingInterval?: ClientConfig['pollingInterval'] | undefined
  retryCount?: TransportConfig['retryCount'] | undefined
  timeout?: TransportConfig['timeout'] | undefined
}) => {
  config: TransportConfig<type>
  request: jsApiStandardRequestFn
  value?: rpcAttributes | undefined
}

export type CreateTransportErrorType = ErrorType

/**
 * @description Creates an transport intended to be used with a client.
 */
export function createTransport<
  type extends string,
  rpcAttributes extends Record<string, any>,
>(
  {
    key,
    name,
    request,
    retryCount = 3,
    retryDelay = 150,
    timeout,
    type,
  }: TransportConfig<type>,
  value?: rpcAttributes | undefined,
): ReturnType<Transport<type, rpcAttributes>> {
  const uid = uid_()
  return {
    config: {
      key,
      name,
      request,
      retryCount,
      retryDelay,
      timeout,
      type,
    },
    request: buildRequest(request, { retryCount, retryDelay, uid }),
    value,
  }
}
