// biome-ignore lint/performance/noBarrelFile: entrypoint module
export { type RequestErrorType, buildRequest } from './buildRequest.js'

export {
  type AssertCurrentChainErrorType,
  type AssertCurrentChainParameters,
  assertCurrentChain,
} from './chain/assertCurrentChain.js'
export { defineChain } from './chain/defineChain.js'
export {
  type ExtractChainErrorType,
  type ExtractChainParameters,
  type ExtractChainReturnType,
  extractChain,
} from './chain/extractChain.js'

export {
  type KlesiaRpcClient,
  type KlesiaRpcClientOptions,
  type KlesiaRequestErrorType,
  type KlesiaRequestParameters,
  type KlesiaRequestReturnType,
  getKlesiaRpcClient,
} from './rpc/klesia.js'
export {
  type GetSocketRpcClientErrorType,
  type GetSocketRpcClientParameters,
  type GetSocketParameters,
  type Socket,
  type SocketRpcClient,
  getSocketRpcClient,
  socketClientCache,
} from './rpc/socket.js'
export { getWebSocketRpcClient } from './rpc/webSocket.js'
export { type StringifyErrorType, stringify } from './stringify.js'
export {
  type ParseAccountErrorType,
  parseAccount,
} from '../accounts/utils/parseAccount.js'
export { getAddress } from './address/getAddress.js'
export {
  type IsAddressErrorType,
  type ChecksumAddressErrorType,
  validateAddressChecksum,
  isAddress,
} from './address/isAddress.js'
export {
  type IsAddressEqualErrorType,
  isAddressEqual,
} from './address/isAddressEqual.js'
export { getAction } from './getAction.js'
export {
  type CreateNonceManagerParameters,
  type NonceManager,
  type NonceManagerSource,
  createNonceManager,
  nonceManager,
} from './nonceManager.js'
