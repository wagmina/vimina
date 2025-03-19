import type { Address } from '../../accounts/index.js'

import { PublicKey, fetchAccount as o1js_fetchAccount } from 'o1js'
import type { Account } from 'o1js/dist/node/lib/mina/account'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain, GetChainParameter } from '../../types/chain.js'
import {
  type AssertCurrentChainErrorType,
  assertCurrentChain,
} from '../../utils/chain/assertCurrentChain.js'
import { getAction } from '../../utils/getAction.js'
import { type GetNetworkIdErrorType, getNetworkId } from './getNetworkId.js'

export type FetchAccountParameters<
  chain extends Chain | undefined = Chain | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
> = {
  /** The address of the account. */
  address: Address
  tokenId?: string
} & GetChainParameter<chain, chainOverride>

export type FetchAccountReturnType = Account

export type FetchAccountErrorType =
  | GetNetworkIdErrorType
  | AssertCurrentChainErrorType
  | ErrorType

export async function fetchAccount<
  chain extends Chain | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain>,
  // { address, blockNumber, blockTag = "latest" }: FetchAccountParameters
  parameters: FetchAccountParameters<chain, chainOverride>,
): Promise<FetchAccountReturnType> {
  const { address, tokenId, chain = client.chain } = parameters
  const networkId = await getAction(client, getNetworkId, 'getNetworkId')({})
  assertCurrentChain({
    currentNetworkId: networkId,
    chain: chain ?? undefined,
  })
  const result = await o1js_fetchAccount(
    tokenId !== undefined
      ? {
          publicKey: PublicKey.fromBase58(address),
          tokenId,
        }
      : {
          publicKey: PublicKey.fromBase58(address),
        },
    chain!.graphqlEndpoint,
  )
  if (result.error) {
    throw result.error
  }
  return result.account
}
