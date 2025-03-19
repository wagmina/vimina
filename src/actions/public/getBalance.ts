import type { Address } from '../../accounts/index.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { RequestErrorType } from '../../utils/buildRequest.js'

export type GetBalanceParameters = {
  /** The address of the account. */
  address: Address
  tokenId?: string
}

export type GetBalanceReturnType = bigint

export type GetBalanceErrorType = RequestErrorType | ErrorType

export async function getBalance<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  { address, tokenId }: GetBalanceParameters,
): Promise<GetBalanceReturnType> {
  const balance: string = await client.request({
    method: 'mina_getBalance',
    params: tokenId !== undefined ? [address, tokenId] : [address],
  })
  return BigInt(balance)
}
