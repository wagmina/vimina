import type { Hex } from './misc.js'
import type { TransactionReceipt } from './transaction.js'
import type { ZkappCommand } from 'o1js/dist/web/bindings/mina-transaction/gen/transaction-json.js'
import type {
  StakeDelegation,
  Payment,
} from 'o1js/dist/web/mina-signer/src/types.js'

export type Quantity = string
export type RpcTransactionReceipt = TransactionReceipt
export type RpcTransactionRequest =
  | {
      zkappCommand: ZkappCommand
    }
  | StakeDelegation
  | Payment
type SuccessResult<result> = {
  method?: undefined
  result: result
  error?: undefined
}
type ErrorResult<error> = {
  method?: undefined
  result?: undefined
  error: error
}
type Subscription<result, error> = {
  method: 'mina_subscription'
  error?: undefined
  result?: undefined
  params:
    | {
        subscription: string
        result: result
        error?: undefined
      }
    | {
        subscription: string
        result?: undefined
        error: error
      }
}

export type RpcRequest = {
  jsonrpc?: '2.0' | undefined
  method: string
  params?: any | undefined
  id?: number | undefined
}

export type RpcResponse<result = any, error = any> = {
  jsonrpc: `${number}`
  id: number
} & (SuccessResult<result> | ErrorResult<error> | Subscription<result, error>)

/** A key-value mapping of slot and storage values (supposedly 32 bytes each) */
export type RpcStateMapping = {
  [slots: Hex]: Hex
}
