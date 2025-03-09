import {
  type ParseAccountErrorType,
  parseAccount,
} from '../../accounts/utils/parseAccount.js'
import type { SendTransactionParameters } from '../../actions/wallet/sendTransaction.js'
import {
  InvalidAddressError,
  type InvalidAddressErrorType,
} from '../../errors/address.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { ExactPartial } from '../../types/utils.js'
import { isAddress } from '../address/isAddress.js'

export type AssertRequestParameters = ExactPartial<
  SendTransactionParameters<Chain>
>

export type AssertRequestErrorType =
  | InvalidAddressErrorType
  | ParseAccountErrorType
  | ErrorType

export function assertRequest(args: AssertRequestParameters) {
  const { account: account_, to, zkappCommand } = args
  if (zkappCommand) return
  const account = account_ ? parseAccount(account_) : undefined
  if (account && !isAddress(account.address))
    throw new InvalidAddressError({ address: account.address })
  if (to && !isAddress(to)) throw new InvalidAddressError({ address: to })
}
