import type { Account, Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { ChecksumAddressErrorType } from '../../utils/address/isAddress.js'
import type { RequestErrorType } from '../../utils/buildRequest.js'

export type GetAddressesReturnType = Address[]

export type GetAddressesErrorType =
  | RequestErrorType
  | ChecksumAddressErrorType
  | ErrorType

/**
 * Returns a list of account addresses owned by the wallet or client.
 *
 * - Docs: https://vimina.sh/docs/actions/wallet/getAddresses
 * - JSON-RPC Methods: [`mina_accounts`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_accounts)
 *
 * @param client - Client to use
 * @returns List of account addresses owned by the wallet or client. {@link GetAddressesReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'vimina'
 * import { mainnet } from 'vimina/chains'
 * import { getAddresses } from 'vimina/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const accounts = await getAddresses(client)
 */
export async function getAddresses<
  chain extends Chain | undefined,
  account extends Account | undefined = undefined,
>(client: Client<Transport, chain, account>): Promise<GetAddressesReturnType> {
  if (client.account?.type === 'local') return [client.account.address]
  return client.request({ method: 'mina_accounts' }, { dedupe: true })
}
