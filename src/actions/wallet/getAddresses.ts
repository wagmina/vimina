import type { Account, Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { ChecksumAddressErrorType } from '../../utils/address/isAddress.js'
import type { RequestErrorType } from '../../utils/buildRequest.js'

export type GetAddressesReturnType = Address[]

export type GetAddressesErrorType =
  | RequestErrorType
  | ChecksumAddressErrorType
  | ErrorType

export async function getAddresses<
  chain extends Chain | undefined,
  account extends Account | undefined = undefined,
>(client: Client<Transport, chain, account>): Promise<GetAddressesReturnType> {
  if (client.account?.type === 'local') return [client.account.address]
  return client.request({ method: 'mina_accounts' }, { dedupe: true })
}
