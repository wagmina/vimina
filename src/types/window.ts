import type { EIP1193Provider } from './eip1193.js'

declare global {
  interface Window {
    mina?: EIP1193Provider | undefined
  }
}
