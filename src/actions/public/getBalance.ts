import type { Address } from '../../accounts/index.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { BlockTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type { RequestErrorType } from '../../utils/buildRequest.js'

export type GetBalanceParameters = {
  /** The address of the account. */
  address: Address
} & (
  | {
      /** The balance of the account at a block number. */
      blockNumber?: bigint | undefined
      blockTag?: undefined
    }
  | {
      blockNumber?: undefined
      /** The balance of the account at a block tag. */
      blockTag?: BlockTag | undefined
    }
)

export type GetBalanceReturnType = bigint

export type GetBalanceErrorType = RequestErrorType | ErrorType

/**
 * Returns the balance of an address in wei.
 *
 * - Docs: https://vimina.sh/docs/actions/public/getBalance
 * - JSON-RPC Methods: [`mina_getBalance`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_getbalance)
 *
 * You can convert the balance to ether units with [`formatEther`](https://vimina.sh/docs/utilities/formatEther).
 *
 * ```ts
 * const balance = await getBalance(client, {
 *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   blockTag: 'safe'
 * })
 * const balanceAsEther = formatEther(balance)
 * // "6.942"
 * ```
 *
 * @param client - Client to use
 * @param parameters - {@link GetBalanceParameters}
 * @returns The balance of the address in wei. {@link GetBalanceReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'vimina'
 * import { mainnet } from 'vimina/chains'
 * import { getBalance } from 'vimina/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const balance = await getBalance(client, {
 *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 * })
 * // 10000000000000000000000n (wei)
 */
export async function getBalance<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  // { address, blockNumber, blockTag = "latest" }: GetBalanceParameters
  { address }: GetBalanceParameters,
): Promise<GetBalanceReturnType> {
  // const blockNumberHex = blockNumber ? numberToHex(blockNumber) : undefined;

  const balance = await client.request({
    method: 'mina_getBalance',
    // params: [address, blockNumberHex || blockTag],
    params: [address],
  })
  return BigInt(balance)
}
