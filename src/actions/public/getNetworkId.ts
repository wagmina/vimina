import type { Account } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { RequestErrorType } from '../../utils/buildRequest.js'

export type GetNetworkIdReturnType = string

export type GetNetworkIdErrorType = RequestErrorType | ErrorType

export async function getNetworkId<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(client: Client<Transport, chain, account>): Promise<GetNetworkIdReturnType> {
  return (
    await client.request(
      {
        method: 'mina_networkId',
      },
      { dedupe: true },
    )
  ).split(':')[1]
}
