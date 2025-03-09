import type { Account } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { RequestErrorType } from '../../utils/buildRequest.js'

export type SwitchChainParameters = {
  /** ID of Chain to switch to */
  id: Chain['id']
}

export type SwitchChainErrorType = RequestErrorType | ErrorType

export async function switchChain<
  chain extends Chain | undefined,
  account extends Account | undefined = undefined,
>(client: Client<Transport, chain, account>, { id }: SwitchChainParameters) {
  await client.request(
    {
      method: 'mina_switchChain',
      params: [id],
    },
    { retryCount: 0 },
  )
}
