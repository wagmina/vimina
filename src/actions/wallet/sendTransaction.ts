import type { Address } from '../../accounts/index.js'

import type { TransactionRequest } from '../../types/transaction.js'
import type { UnionOmit } from '../../types/utils.js'

import type {
  SendPaymentArgs,
  SendStakeDelegationArgs,
  SendTransactionArgs,
} from '@aurowallet/mina-provider'
import { formatMina } from '@mina-js/utils'
import type { Account } from '../../accounts/types.js'
import {
  type ParseAccountErrorType,
  parseAccount,
} from '../../accounts/utils/parseAccount.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import {
  AccountNotFoundError,
  AccountTypeNotSupportedError,
} from '../../errors/account.js'
import { BaseError } from '../../errors/base.js'
import type { ErrorType } from '../../errors/utils.js'
import type { GetAccountParameter } from '../../types/account.js'
import type { Chain, GetChainParameter } from '../../types/chain.js'
import type { Hash } from '../../types/misc.js'
import { assertCurrentChain } from '../../utils/chain/assertCurrentChain.js'
import { getAction } from '../../utils/getAction.js'
import {
  type AssertRequestParameters,
  assertRequest,
} from '../../utils/transaction/assertRequest.js'
import { getNetworkId } from '../public/getNetworkId.js'

export type SendTransactionRequest = UnionOmit<TransactionRequest, 'from'>

export type SendTransactionParameters<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  request extends SendTransactionRequest = SendTransactionRequest,
> = request &
  GetAccountParameter<account, Account | Address, true, true> &
  GetChainParameter<chain, chainOverride>

export type SendTransactionReturnType = Hash

export type TransactionTypeNotSupportedErrorType =
  TransactionTypeNotSupportedError & {
    name: 'TransactionTypeNotSupportedError'
  }
export class TransactionTypeNotSupportedError extends BaseError {
  constructor({
    docsPath,
    metaMessages,
    type,
  }: {
    docsPath?: string | undefined
    metaMessages?: string[] | undefined
    type: string
  }) {
    super(`Transaction type "${type}" is not supported.`, {
      docsPath,
      metaMessages,
      name: 'TransactionTypeNotSupportedError',
    })
  }
}

export type SendTransactionErrorType =
  | ParseAccountErrorType
  // TODO: implement getTransactionError function
  // | GetTransactionErrorReturnType<
  //     | AccountNotFoundErrorType
  //     | AccountTypeNotSupportedErrorType
  //     | AssertCurrentChainErrorType
  //     | AssertRequestErrorType
  //     | GetNetworkIdErrorType
  //     | SendSignedTransactionErrorType
  //     | SignTransactionErrorType
  //     | RequestErrorType
  //   >
  | TransactionTypeNotSupportedErrorType
  | ErrorType

export async function sendTransaction<
  chain extends Chain | undefined,
  account extends Account | undefined,
  const request extends TransactionRequest,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: SendTransactionParameters<chain, account, chainOverride, request>,
): Promise<SendTransactionReturnType> {
  const {
    account: account_ = client.account,
    chain = client.chain,
    ...rest
  } = parameters

  if (typeof account_ === 'undefined') throw new AccountNotFoundError()
  const account = account_ ? parseAccount(account_) : null

  // try {
  assertRequest(parameters as AssertRequestParameters)
  if (account?.type === 'json-rpc' || account === null) {
    if (chain !== null) {
      const networkId = await getAction(
        client,
        getNetworkId,
        'getNetworkId',
      )({})
      assertCurrentChain({
        currentNetworkId: networkId,
        chain,
      })
    }
    switch (parameters.type) {
      case 'zkapp': {
        const auroWalletTransactionParams: SendTransactionArgs = {
          transaction: JSON.stringify(parameters.zkappCommand),
          nonce: parameters.feePayer?.nonce
            ? Number(parameters.feePayer.nonce)
            : undefined,
          // @ts-ignore for exactOptionalPropertyTypes
          feePayer: parameters.feePayer
            ? {
                fee: parameters.feePayer.fee
                  ? Number(formatMina(parameters.feePayer.fee))
                  : undefined,
                memo: parameters.feePayer.memo,
              }
            : undefined,
        }
        const res = (await client.request(
          {
            // @ts-ignore
            method: 'mina_sendTransaction',
            // @ts-ignore
            params: auroWalletTransactionParams,
          },
          { retryCount: 0 },
        )) as { hash: string }
        return res.hash
      }
      case 'payment': {
        // @ts-ignore for exactOptionalPropertyTypes
        const auroWalletPaymentParams: SendPaymentArgs = {
          to: parameters.to,
          fee: parameters.fee ? Number(formatMina(parameters.fee)) : undefined,
          amount: Number(formatMina(parameters.amount)),
          memo: parameters.memo,
          nonce: parameters.nonce ? Number(parameters.nonce) : undefined,
        }
        const res = (await client.request(
          {
            // @ts-ignore
            method: 'mina_sendPayment',
            // @ts-ignore
            params: auroWalletPaymentParams,
          },
          { retryCount: 0 },
        )) as { hash: string }
        return res.hash
      }
      case 'delegation': {
        // @ts-ignore for exactOptionalPropertyTypes
        const auroWalletDelegationParams: SendStakeDelegationArgs = {
          to: parameters.to,
          fee: parameters.fee ? Number(formatMina(parameters.fee)) : undefined,
          memo: parameters.memo,
          nonce: parameters.nonce ? Number(parameters.nonce) : undefined,
        }
        return (
          (await client.request(
            {
              // @ts-ignore
              method: 'mina_sendStakeDelegation',
              // @ts-ignore
              params: auroWalletDelegationParams,
            },
            { retryCount: 0 },
          )) as { hash: string }
        ).hash
      }
      default:
        throw new TransactionTypeNotSupportedError({
          type: rest.type,
        })
    }
  }

  throw new AccountTypeNotSupportedError({
    type: (account as any)?.type,
  })
  // TODO: implement getTransactionError function
  // } catch (err) {
  //   if (
  //     err instanceof AccountTypeNotSupportedError ||
  //     err instanceof TransactionTypeNotSupportedError
  //   )
  //     throw err
  //   throw getTransactionError(err as BaseError, {
  //     ...parameters,
  //     account,
  //     chain: parameters.chain || undefined,
  //   })
  // }
}
