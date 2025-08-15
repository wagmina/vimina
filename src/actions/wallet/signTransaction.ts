import type { SendTransactionArgs } from '@aurowallet/mina-provider'
import { formatMina } from '@mina-js/utils'
import type { ZkappCommand } from 'o1js/dist/web/bindings/mina-transaction/gen/transaction-json'
import type { Account } from '../../accounts/types.js'
import {
  type ParseAccountErrorType,
  parseAccount,
} from '../../accounts/utils/parseAccount.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import { AccountNotFoundError } from '../../errors/account.js'
import type { ErrorType } from '../../errors/utils.js'
import type { GetAccountParameter } from '../../types/account.js'
import type { Chain, GetChainParameter } from '../../types/chain.js'
import type { Signature } from '../../types/misc.js'
import type {
  TransactionRequest,
  TransactionRequestDelegation,
  TransactionRequestPayment,
  TransactionRequestZkApp,
  TransactionType,
} from '../../types/transaction.js'
import type { UnionOmit } from '../../types/utils.js'
import type { RequestErrorType } from '../../utils/buildRequest.js'
import {
  type AssertCurrentChainErrorType,
  assertCurrentChain,
} from '../../utils/chain/assertCurrentChain.js'
import { getAction } from '../../utils/getAction.js'
import {
  type AssertRequestErrorType,
  assertRequest,
} from '../../utils/transaction/assertRequest.js'
import {
  type GetNetworkIdErrorType,
  getNetworkId,
} from '../public/getNetworkId.js'
import { TransactionTypeNotSupportedError } from './sendTransaction.js'

export type SignTransactionRequest = UnionOmit<TransactionRequest, 'from'>

export type SignTransactionRequestByType<T extends TransactionType> =
  T extends 'zkapp'
    ? TransactionRequestZkApp
    : T extends 'payment'
      ? Omit<TransactionRequestPayment, 'from'>
      : T extends 'delegation'
        ? Omit<TransactionRequestDelegation, 'from'>
        : never

export type SignTransactionParameters<
  transactionType extends TransactionType,
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
> = SignTransactionRequestByType<transactionType> &
  GetAccountParameter<account> &
  GetChainParameter<chain, chainOverride>

export type SignTransactionReturnType<transactionType extends TransactionType> =
  transactionType extends 'zkapp' ? ZkappCommand : Signature

export type SignTransactionErrorType =
  | ParseAccountErrorType
  | AssertRequestErrorType
  | GetNetworkIdErrorType
  | AssertCurrentChainErrorType
  | RequestErrorType
  | ErrorType

export async function signTransaction<
  transactionType extends TransactionType,
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: SignTransactionParameters<
    transactionType,
    chain,
    account,
    chainOverride
  >,
): Promise<SignTransactionReturnType<transactionType>> {
  const {
    account: account_ = client.account,
    chain = client.chain,
    ...transaction
  } = parameters

  if (!account_) throw new AccountNotFoundError()
  const account = parseAccount(account_)

  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log({ parameters })

  assertRequest({
    account,
    ...parameters,
  })

  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log('assertRequest done')
  const networkId = await getAction(client, getNetworkId, 'getNetworkId')({})
  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log({ networkId })
  if (chain !== null)
    assertCurrentChain({
      currentNetworkId: networkId,
      chain,
    })

  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log('assertRequest done')
  // if (account.signTransaction)
  //   return account.signTransaction(
  //     {
  //       ...transaction,
  //       networkId,
  //     } as TransactionSerializable,
  //     { serializer: client.chain?.serializers?.transaction },
  //   ) as Promise<SignTransactionReturnType<request>>

  switch (parameters.type) {
    case 'zkapp': {
      // biome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log('zkapp')
      /* TODO: remove this try catch block after having a standard way of
           signing transactions with both AuroWallet and Pallad */
      // First try it AuroWallet's way
      try {
        const auroWalletTransactionParams: SendTransactionArgs = {
          transaction: JSON.stringify(parameters.zkappCommand),
          // @ts-ignore for exactOptionalPropertyTypes
          feePayer: parameters.feePayer
            ? {
                fee: parameters.feePayer.fee
                  ? Number(formatMina(parameters.feePayer.fee))
                  : undefined,
                memo: parameters.feePayer.memo,
              }
            : undefined,
          nonce: parameters.feePayer?.nonce
            ? Number(parameters.feePayer.nonce)
            : undefined,
          onlySign: true,
        }
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log({ auroWalletTransactionParams })
        const res = (await client.request(
          {
            // @ts-ignore
            method: 'mina_sendTransaction',
            // @ts-ignore
            params: auroWalletTransactionParams,
          },
          { retryCount: 0 },
        )) as { signedData: string }
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log({ res })
        return JSON.parse(res.signedData)
          .zkappCommand as SignTransactionReturnType<transactionType>
      } catch (e: any) {
        let palladErrorCode: string
        try {
          palladErrorCode = JSON.parse(e.details)[0].code
        } catch (_e_) {
          throw e
        }
        if (palladErrorCode === 'invalid_type') {
          // Try it Pallad's way
          const res = (await client.request(
            {
              // @ts-ignore
              method: 'mina_signTransaction',
              params: [
                // @ts-ignore
                {
                  // @ts-ignore
                  command: {
                    zkappCommand: parameters.zkappCommand,
                    feePayer: parameters.feePayer
                      ? {
                          fee:
                            parameters.feePayer.fee !== undefined
                              ? parameters.feePayer.fee.toString()
                              : undefined,
                          feePayer: parameters.feePayer.publicKey,
                          nonce:
                            parameters.feePayer.nonce !== undefined
                              ? String(parameters.feePayer.nonce)
                              : undefined,
                          validUntil: parameters.feePayer.validUntil,
                          memo: parameters.feePayer.memo,
                        }
                      : undefined,
                  },
                },
              ],
            },
            { retryCount: 0 },
          )) as { data: { zkappCommand: ZkappCommand } }
          return res.data
            .zkappCommand as SignTransactionReturnType<transactionType>
        }
        throw e
      }
    }
    case 'payment': {
      const res = (await client.request(
        {
          // @ts-ignore
          method: 'mina_signTransaction',
          params: [
            // @ts-ignore
            {
              // @ts-ignore
              transaction: {
                fee:
                  parameters?.fee !== undefined
                    ? parameters.fee.toString()
                    : undefined,
                from: account.address,
                to: parameters?.to,
                nonce: String(parameters?.nonce),
                memo: parameters?.memo,
              },
            },
          ],
        },
        { retryCount: 0 },
      )) as { signature: Signature }
      return res.signature as SignTransactionReturnType<transactionType>
    }
    default:
      throw new TransactionTypeNotSupportedError({
        type: transaction.type,
      })
  }
}
