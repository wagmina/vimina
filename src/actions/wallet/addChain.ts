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
  const { id, name, nativeCurrency, rpcUrls, blockExplorers } = chain
  await client.request(
    {
      method: 'wallet_addMinaChain',
      params: [
        {
          networkId: id,
          chainName: name,
          nativeCurrency,
          rpcUrls: rpcUrls.default.graphql,
          blockExplorerUrls: blockExplorers
            ? Object.values(blockExplorers).map(({ url }) => url)
            : undefined,
        },
      ],
    },
    { dedupe: true, retryCount: 0 },
  )
}
