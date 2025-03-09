import type { Address } from '../accounts/types.js'
import type { Hex } from './misc.js'
import type { Quantity } from './rpc.js'
import type { OneOf, Prettify } from './utils.js'

//////////////////////////////////////////////////
// Provider

export type EIP1474Methods = [...PublicRpcSchema, ...WalletRpcSchema]

export type RPCStandardProvider = Prettify<
  RPCStandardEvents & {
    request: RPCStandardRequestFn<EIP1474Methods>
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

export type RPCStandardEventMap = {
  accountsChanged(accounts: Address[]): void
  chainChanged(networkId: string): void
  connect(connectInfo: ProviderConnectInfo): void
  disconnect(error: ProviderRpcError): void
  message(message: ProviderMessage): void
}

export type RPCStandardEvents = {
  on<event extends keyof RPCStandardEventMap>(
    event: event,
    listener: RPCStandardEventMap[event],
  ): void
  removeListener<event extends keyof RPCStandardEventMap>(
    event: event,
    listener: RPCStandardEventMap[event],
  ): void
}

//////////////////////////////////////////////////
// Provider Requests

export type AddMinaChainParameter = {
  /** A 0x-prefixed hexadecimal string */
  networkId: string
  /** The chain name. */
  chainName: string
  /** Native currency for the chain. */
  nativeCurrency?:
    | {
        name: string
        symbol: string
        decimals: number
      }
    | undefined
  rpcUrls: readonly string[]
  blockExplorerUrls?: string[] | undefined
  iconUrls?: string[] | undefined
}

export type NetworkSync = {
  /** The current block number */
  currentBlock: Quantity
  /** Number of latest block on the network */
  highestBlock: Quantity
  /** Block number at which syncing started */
  startingBlock: Quantity
}

export type WalletCapabilities = {
  [capability: string]: any
}

export type WalletCapabilitiesRecord<
  capabilities extends WalletCapabilities = WalletCapabilities,
  id extends string | number = Hex,
> = {
  [networkId in id]: capabilities
}

export type WalletCallReceipt<quantity = Hex, status = Hex> = {
  logs: {
    address: Hex
    data: Hex
    topics: Hex[]
  }[]
  status: status
  blockHash: Hex
  blockNumber: quantity
  gasUsed: quantity
  transactionHash: Hex
}

export type WalletGrantPermissionsParameters = {
  signer?:
    | {
        type: string
        data?: unknown | undefined
      }
    | undefined
  permissions: readonly {
    data: unknown
    policies: readonly {
      data: unknown
      type: string
    }[]
    required?: boolean | undefined
    type: string
  }[]
  expiry: number
}

export type WalletGrantPermissionsReturnType = {
  expiry: number
  factory?: `0x${string}` | undefined
  factoryData?: string | undefined
  grantedPermissions: readonly {
    data: unknown
    policies: readonly {
      data: unknown
      type: string
    }[]
    required?: boolean | undefined
    type: string
  }[]
  permissionsContext: string
  signerData?:
    | {
        userOpBuilder?: `0x${string}` | undefined
        submitToAddress?: `0x${string}` | undefined
      }
    | undefined
}

export type WalletGetCallsStatusReturnType<quantity = Hex, status = Hex> = {
  status: 'PENDING' | 'CONFIRMED'
  receipts?: WalletCallReceipt<quantity, status>[] | undefined
}

export type WalletPermissionCaveat = {
  type: string
  value: any
}

export type WalletPermission = {
  caveats: WalletPermissionCaveat[]
  date: number
  id: string
  invoker: `http://${string}` | `https://${string}`
  parentCapability: 'mina_accounts' | string
}

export type WalletSendCallsParameters<
  capabilities extends WalletCapabilities = WalletCapabilities,
  networkId extends string = string,
  quantity extends Quantity | bigint = Quantity,
> = [
  {
    calls: OneOf<
      | {
          to: Address
          data?: Hex | undefined
          value?: quantity | undefined
        }
      | {
          data: Hex
        }
    >[]
    capabilities?: capabilities | undefined
    networkId: networkId
    from: Address
    version: string
  },
]

export type WatchAssetParams = {
  /** Token type. */
  type: 'ERC20'
  options: {
    /** The address of the token contract */
    address: string
    /** A ticker symbol or shorthand, up to 11 characters */
    symbol: string
    /** The number of token decimals */
    decimals: number
    /** A string url of the token logo */
    image?: string | undefined
  }
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
    Parameters: [
      address: Address,
      // block: BlockHash | BlockTag | BlockIdentifier
    ]
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
    Method: 'wallet_addMinaChain'
    Parameters: [chain: AddMinaChainParameter]
    ReturnType: null
  },
  {
    Method: 'wallet_getCapabilities'
    Parameters?: [Address]
    ReturnType: Prettify<WalletCapabilitiesRecord>
  },
  {
    Method: 'wallet_getPermissions'
    Parameters?: undefined
    ReturnType: WalletPermission[]
  },
  {
    Method: 'wallet_grantPermissions'
    Parameters?: [WalletGrantPermissionsParameters]
    ReturnType: Prettify<WalletGrantPermissionsReturnType>
  },
  {
    Method: 'wallet_requestPermissions'
    Parameters: [permissions: { mina_accounts: Record<string, any> }]
    ReturnType: WalletPermission[]
  },
  {
    Method: 'wallet_revokePermissions'
    Parameters: [permissions: { mina_accounts: Record<string, any> }]
    ReturnType: null
  },
  {
    Method: 'mina_switchChain'
    Parameters: [networkId: string]
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

export type RPCStandardParameters<
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

export type RPCStandardRequestOptions = {
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

export type RPCStandardRequestFn<
  rpcSchema extends RpcSchema | undefined = undefined,
> = <
  rpcSchemaOverride extends RpcSchemaOverride | undefined = undefined,
  _parameters extends RPCStandardParameters<
    DerivedRpcSchema<rpcSchema, rpcSchemaOverride>
  > = RPCStandardParameters<DerivedRpcSchema<rpcSchema, rpcSchemaOverride>>,
  _returnType = DerivedRpcSchema<rpcSchema, rpcSchemaOverride> extends RpcSchema
    ? Extract<
        DerivedRpcSchema<rpcSchema, rpcSchemaOverride>[number],
        { Method: _parameters['method'] }
      >['ReturnType']
    : unknown,
>(
  args: _parameters,
  options?: RPCStandardRequestOptions | undefined,
) => Promise<_returnType>
