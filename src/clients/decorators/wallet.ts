import type { Account } from '../../accounts/types.js'
import {
  type GetNetworkIdReturnType,
  getNetworkId,
} from '../../actions/public/getNetworkId.js'
import {
  type AddChainParameters,
  addChain,
} from '../../actions/wallet/addChain.js'
import {
  type GetAddressesReturnType,
  getAddresses,
} from '../../actions/wallet/getAddresses.js'
import {
  type GetPermissionsReturnType,
  getPermissions,
} from '../../actions/wallet/getPermissions.js'
import {
  type RequestAddressesReturnType,
  requestAddresses,
} from '../../actions/wallet/requestAddresses.js'
import {
  type RequestPermissionsParameters,
  type RequestPermissionsReturnType,
  requestPermissions,
} from '../../actions/wallet/requestPermissions.js'
import {
  type SwitchChainParameters,
  switchChain,
} from '../../actions/wallet/switchChain.js'
import type { Chain } from '../../types/chain.js'
import type { Client } from '../createClient.js'
import type { Transport } from '../transports/createTransport.js'

export type WalletActions<
  _chain extends Chain | undefined = Chain | undefined,
  _account extends Account | undefined = Account | undefined,
> = {
  addChain: (args: AddChainParameters) => Promise<void>
  getAddresses: () => Promise<GetAddressesReturnType>
  getNetworkId: () => Promise<GetNetworkIdReturnType>
  getPermissions: () => Promise<GetPermissionsReturnType>
  requestAddresses: () => Promise<RequestAddressesReturnType>
  requestPermissions: (
    args: RequestPermissionsParameters,
  ) => Promise<RequestPermissionsReturnType>
  switchChain: (args: SwitchChainParameters) => Promise<void>
}

export function walletActions<
  transport extends Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
>(client: Client<transport, chain, account>): WalletActions<chain, account> {
  return {
    addChain: (args) => addChain(client, args),
    getAddresses: () => getAddresses(client),
    getNetworkId: () => getNetworkId(client),
    getPermissions: () => getPermissions(client),
    requestAddresses: () => requestAddresses(client),
    requestPermissions: (args) => requestPermissions(client, args),
    switchChain: (args) => switchChain(client, args),
  }
}
