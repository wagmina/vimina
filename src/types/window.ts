import type { RPCStandardProvider } from './rpcStandard.js'

declare global {
  interface Window {
    mina?: RPCStandardProvider | undefined
  }
}
