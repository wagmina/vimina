import type { Address } from '../accounts/types.js'
import type { Quantity } from './rpc.js'
import type { Prettify } from './utils.js'

//////////////////////////////////////////////////
// Provider

export type RPCStandardMethods = [...PublicRpcSchema, ...WalletRpcSchema]

export type JSAPIStandardProvider = Prettify<
  JSAPIStandardEvents & {
    request: JSAPIStandardRequestFn<RPCStandardMethods>
  }
>

//////////////////////////////////////////////////
// Errors

export type ProviderRpcErrorType = ProviderRpcError & {
  name: 'ProviderRpcError'
}

export class ProviderRpcError extends Error {
  code: number
  details: string

  constructor(code: number, message: string) {
    super(message)
    this.code = code
    this.details = message
  }
}

//////////////////////////////////////////////////
// Provider Events

export type ProviderConnectInfo = {
  networkId: string
}

export type ProviderMessage = {
  type: string
  data: unknown
}

export type JSAPIStandardEventMap = {
  accountsChanged(accounts: Address[]): void
  chainChanged(networkId: string): void
  connect(connectInfo: ProviderConnectInfo): void
  disconnect(error: ProviderRpcError): void
  message(message: ProviderMessage): void
}

export type JSAPIStandardEvents = {
  on<event extends keyof JSAPIStandardEventMap>(
    event: event,
    listener: JSAPIStandardEventMap[event],
  ): void
  removeListener<event extends keyof JSAPIStandardEventMap>(
    event: event,
    listener: JSAPIStandardEventMap[event],
  ): void
}

//////////////////////////////////////////////////
// Provider Requests

export type AddMinaChainParameter = {
  url: string
}

export type PublicRpcSchema = [
  {
    Method: 'mina_blockHash'
    Parameters?: undefined
    ReturnType: string
  },
  {
    Method: 'mina_networkId'
    Parameters?: undefined
    ReturnType: string
  },
  {
    Method: 'mina_getBalance'
    Parameters: [address: Address, tokenId?: string]
    ReturnType: Quantity
  },
  {
    Method: 'mina_getTransactionCount'
    Parameters: [address: Address]
    ReturnType: Quantity
  },
]

export type WalletRpcSchema = [
  {
    Method: 'mina_accounts'
    Parameters?: undefined
    ReturnType: Address[]
  },
  {
    Method: 'mina_addChain'
    Parameters: [chain: AddMinaChainParameter]
    ReturnType: null
  },
  {
    Method: 'mina_networkId'
    Parameters?: undefined
    ReturnType: string
  },
  {
    Method: 'mina_requestAccounts'
    Parameters?: undefined
    ReturnType: Address[]
  },
  {
    Method: 'mina_switchChain'
    Parameters: [networkId: string]
    ReturnType: null
  },
  {
    Method: 'wallet_revokePermissions'
    Parameters?: undefined
    ReturnType: null
  },
]

///////////////////////////////////////////////////////////////////////////
// Utils

export type RpcSchema = readonly {
  Method: string
  Parameters?: unknown | undefined
  ReturnType: unknown
}[]

export type RpcSchemaOverride = Omit<RpcSchema[number], 'Method'>

export type JSAPIStandardParameters<
  rpcSchema extends RpcSchema | undefined = undefined,
> = rpcSchema extends RpcSchema
  ? {
      [K in keyof rpcSchema]: Prettify<
        {
          method: rpcSchema[K] extends rpcSchema[number]
            ? rpcSchema[K]['Method']
            : never
        } & (rpcSchema[K] extends rpcSchema[number]
          ? rpcSchema[K]['Parameters'] extends undefined
            ? { params?: undefined }
            : { params: rpcSchema[K]['Parameters'] }
          : never)
      >
    }[number]
  : {
      method: string
      params?: unknown | undefined
    }

export type JSAPIStandardRequestOptions = {
  // Deduplicate in-flight requests.
  dedupe?: boolean | undefined
  // The base delay (in ms) between retries.
  retryDelay?: number | undefined
  // The max number of times to retry.
  retryCount?: number | undefined
  /** Unique identifier for the request. */
  uid?: string | undefined
}

type DerivedRpcSchema<
  rpcSchema extends RpcSchema | undefined,
  rpcSchemaOverride extends RpcSchemaOverride | undefined,
> = rpcSchemaOverride extends RpcSchemaOverride
  ? [rpcSchemaOverride & { Method: string }]
  : rpcSchema

export type JSAPIStandardRequestFn<
  rpcSchema extends RpcSchema | undefined = undefined,
> = <
  rpcSchemaOverride extends RpcSchemaOverride | undefined = undefined,
  _parameters extends JSAPIStandardParameters<
    DerivedRpcSchema<rpcSchema, rpcSchemaOverride>
  > = JSAPIStandardParameters<DerivedRpcSchema<rpcSchema, rpcSchemaOverride>>,
  _returnType = DerivedRpcSchema<rpcSchema, rpcSchemaOverride> extends RpcSchema
    ? Extract<
        DerivedRpcSchema<rpcSchema, rpcSchemaOverride>[number],
        { Method: _parameters['method'] }
      >['ReturnType']
    : unknown,
>(
  args: _parameters,
  options?: JSAPIStandardRequestOptions | undefined,
) => Promise<_returnType>
