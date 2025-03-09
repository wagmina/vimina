import {
  ChainMismatchError,
  type ChainMismatchErrorType,
  ChainNotFoundError,
  type ChainNotFoundErrorType,
} from '../../errors/chain.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'

export type AssertCurrentChainParameters = {
  chain?: Chain | undefined
  currentNetworkId: string
}

export type AssertCurrentChainErrorType =
  | ChainNotFoundErrorType
  | ChainMismatchErrorType
  | ErrorType

export function assertCurrentChain({
  chain,
  currentNetworkId,
}: AssertCurrentChainParameters): void {
  if (!chain) throw new ChainNotFoundError()
  if (currentNetworkId !== chain.id)
    throw new ChainMismatchError({ chain, currentNetworkId })
}
