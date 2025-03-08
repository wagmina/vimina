import type { Account } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { WalletPermission } from '../../types/eip1193.js'
import type { Prettify } from '../../types/utils.js'
import type { RequestErrorType } from '../../utils/buildRequest.js'

export type RequestPermissionsParameters = Prettify<
  {
    mina_accounts: Record<string, any>
  } & {
    [key: string]: Record<string, any>
  }
>
export type RequestPermissionsReturnType = WalletPermission[]

export type RequestPermissionsErrorType = RequestErrorType | ErrorType

/**
 * Requests permissions for a wallet.
 *
 * - Docs: https://vimina.sh/docs/actions/wallet/requestPermissions
 * - JSON-RPC Methods: [`wallet_requestPermissions`](https://eips.ethereum.org/EIPS/eip-2255)
 *
 * @param client - Client to use
 * @param parameters - {@link RequestPermissionsParameters}
 * @returns The wallet permissions. {@link RequestPermissionsReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'vimina'
 * import { mainnet } from 'vimina/chains'
 * import { requestPermissions } from 'vimina/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const permissions = await requestPermissions(client, {
 *   mina_accounts: {}
 * })
 */
export async function requestPermissions<
  chain extends Chain | undefined,
  account extends Account | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  permissions: RequestPermissionsParameters,
) {
  return client.request(
    {
      method: 'wallet_requestPermissions',
      params: [permissions],
    },
    { retryCount: 0 },
  )
}
