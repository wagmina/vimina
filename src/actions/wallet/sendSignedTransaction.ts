import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { Hash } from '../../types/misc.js'
import type { TransactionRequestSigned } from '../../types/transaction.js'
import type { RequestErrorType } from '../../utils/buildRequest.js'

export type SendSignedTransactionParameters = TransactionRequestSigned

export type SendSignedTransactionReturnType = Hash

export type SendSignedTransactionErrorType = RequestErrorType | ErrorType

export async function sendSignedTransaction<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: SendSignedTransactionParameters,
): Promise<SendSignedTransactionReturnType> {
  const { type, ...rest } = parameters
  return client.request(
    {
      // @ts-ignore
      method: 'mina_sendTransaction',
      // @ts-ignore
      params: [rest, type],
    },
    { retryCount: 0 },
  )
}
