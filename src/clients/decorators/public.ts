import {
  type FetchAccountParameters,
  type FetchAccountReturnType,
  fetchAccount,
} from '../../actions/public/fetchAccount.js'
import {
  type GetBalanceParameters,
  type GetBalanceReturnType,
  getBalance,
} from '../../actions/public/getBalance.js'
import {
  type GetBlockHashParameters,
  type GetBlockHashReturnType,
  getBlockHash,
} from '../../actions/public/getBlockHash.js'
import {
  type GetNetworkIdReturnType,
  getNetworkId,
} from '../../actions/public/getNetworkId.js'
import {
  type GetTransactionCountParameters,
  type GetTransactionCountReturnType,
  getTransactionCount,
} from '../../actions/public/getTransactionCount.js'
import {
  type WatchBlockHashParameters,
  type WatchBlockHashReturnType,
  watchBlockHash,
} from '../../actions/public/watchBlockHash.js'
import type { Account } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import type { Client } from '../createClient.js'
import type { Transport } from '../transports/createTransport.js'

export type PublicActions<
  _transport extends Transport = Transport,
  _chain extends Chain | undefined = Chain | undefined,
  _account extends Account | undefined = Account | undefined,
> = {
  fetchAccount: (
    args: FetchAccountParameters,
  ) => Promise<FetchAccountReturnType>
  getBalance: (args: GetBalanceParameters) => Promise<GetBalanceReturnType>
  getBlockHash: (
    args?: GetBlockHashParameters | undefined,
  ) => Promise<GetBlockHashReturnType>
  getNetworkId: () => Promise<GetNetworkIdReturnType>
  getTransactionCount: (
    args: GetTransactionCountParameters,
  ) => Promise<GetTransactionCountReturnType>
  watchBlockHash: (args: WatchBlockHashParameters) => WatchBlockHashReturnType
}

export function publicActions<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
>(
  client: Client<transport, chain, account>,
): PublicActions<transport, chain, account> {
  return {
    fetchAccount: (args) => fetchAccount(client, args),
    getBalance: (args) => getBalance(client, args),
    getBlockHash: (args) => getBlockHash(client, args),
    getNetworkId: () => getNetworkId(client),
    getTransactionCount: (args) => getTransactionCount(client, args),
    watchBlockHash: (args) => watchBlockHash(client, args),
  }
}
