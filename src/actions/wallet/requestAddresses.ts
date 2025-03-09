import type { Account, Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import { getAddress } from '../../utils/address/getAddress.js'
import type { RequestErrorType } from '../../utils/buildRequest.js'

export type RequestAddressesReturnType = Address[]

export type RequestAddressesErrorType = RequestErrorType | ErrorType

export async function requestAddresses<
  chain extends Chain | undefined,
  account extends Account | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
): Promise<RequestAddressesReturnType> {
  const addresses = await client.request(
    { method: 'mina_requestAccounts' },
    { dedupe: true, retryCount: 0 },
  )
  return addresses.map((address) => getAddress(address))
}
