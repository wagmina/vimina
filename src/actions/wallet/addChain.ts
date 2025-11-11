import type { Account } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { RequestErrorType } from '../../utils/buildRequest.js'

export type AddChainParameters = {
  /** The chain to add to the wallet. */
  chain: Chain
}

export type AddChainErrorType = RequestErrorType | ErrorType

export async function addChain<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(client: Client<Transport, chain, account>, { chain }: AddChainParameters) {
  const { rpcUrls, id } = chain
  try {
    await client.request(
      {
        method: 'mina_addChain',
        params: [
          {
            url: rpcUrls.default.http[0],
          },
        ],
      },
      { dedupe: true, retryCount: 0 },
    )
  } catch (_e) {}
  // Try it AuroWallet's way
  await client.request(
    {
      method: 'mina_addChain',
      params: {
        // @ts-ignore
        url: rpcUrls.default.http[0],
        name: `mina:${id}`,
      },
    },
    { dedupe: true, retryCount: 0 },
  )
}
