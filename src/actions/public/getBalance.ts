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
  tokenId?: string
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

export async function getBalance<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  // { address, blockNumber, blockTag = "latest" }: GetBalanceParameters
  { address, tokenId }: GetBalanceParameters,
): Promise<GetBalanceReturnType> {
  // const blockNumberHex = blockNumber ? numberToHex(blockNumber) : undefined;

  const balance: string = await client.request({
    method: 'mina_getBalance',
    // params: [address, blockNumberHex || blockTag],
    params: tokenId !== undefined ? [address, tokenId] : [address],
  })
  return BigInt(balance)
}
