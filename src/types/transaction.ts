import type { ZkappCommand } from 'o1js/dist/web/bindings/mina-transaction/gen/transaction-json'
import type { UInt32 } from 'o1js/dist/web/bindings/mina-transaction/transaction-leaves-json'
import type { Hash, Signature } from './misc.js'
import type { OneOf } from './utils.js'

export type TransactionType = 'zkapp' | 'payment' | 'delegation' | (string & {})

export type TransactionReceipt = {
  /** Hash of this transaction */
  transactionHash: Hash
}

////////////////////////////////////////////////////////////////////////////////////////////
// Request
////////////////////////////////////////////////////////////////////////////////////////////

export type TransactionRequestZkApp = {
  type: 'zkapp'
  zkappCommand: ZkappCommand
  feePayer?: {
    publicKey?: string
    fee?: bigint
    validUntil?: UInt32
    nonce?: UInt32
    memo?: string
  }
}
export type TransactionRequestPayment = {
  type: 'payment'
  from: string
  to: string
  amount: bigint
  fee?: bigint
  nonce?: UInt32
  memo?: string
}
export type TransactionRequestDelegation = {
  type: 'delegation'
  from: string
  to: string
  fee?: bigint
  nonce?: UInt32
  memo?: string
}

export type TransactionRequest = OneOf<
  | TransactionRequestZkApp
  | TransactionRequestPayment
  | TransactionRequestDelegation
>

////////////////////////////////////////////////////////////////////////////////////////////
// Signed Request
////////////////////////////////////////////////////////////////////////////////////////////

//TODO: see if optional nonce can also be added to the types or not
export type TransactionRequestZkAppSigned = {
  type: 'zkapp'
  input: {
    zkappCommand: ZkappCommand
  }
}
export type TransactionRequestPaymentSigned = {
  type: 'payment'
  input: Omit<TransactionRequestPayment, 'type'>
  signature: Signature
}
export type TransactionRequestDelegationSigned = {
  type: 'delegation'
  input: Omit<TransactionRequestDelegation, 'type'>
  signature: Signature
}

export type TransactionRequestSigned = OneOf<
  | TransactionRequestZkAppSigned
  | TransactionRequestPaymentSigned
  | TransactionRequestDelegationSigned
>
