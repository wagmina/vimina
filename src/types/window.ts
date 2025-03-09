import type { JSAPIStandardProvider } from './jsApiStandard.js'

declare global {
  interface Window {
    mina?: JSAPIStandardProvider | undefined
  }
}
