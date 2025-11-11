import type { Account, Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { BlockTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type { RequestErrorType } from '../../utils/buildRequest.js'

export type GetTransactionCountParameters = {
  /** The account address. */
  address: Address
} & (
  | {
      /** The block number. */
      blockNumber?: bigint | undefined
      blockTag?: undefined
    }
  | {
      blockNumber?: undefined
      /** The block tag. Defaults to 'latest'. */
      blockTag?: BlockTag | undefined
    }
)
export type GetTransactionCountReturnType = number

export type GetTransactionCountErrorType = RequestErrorType | ErrorType

export async function getTransactionCount<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  { address, blockNumber }: GetTransactionCountParameters,
): Promise<GetTransactionCountReturnType> {
  const transactionCount = await client.request(
    {
      method: 'mina_getTransactionCount',
      params: [address],
    },
    { dedupe: Boolean(blockNumber) },
  )
  return Number(transactionCount)
}
