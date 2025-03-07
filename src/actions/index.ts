// biome-ignore lint/performance/noBarrelFile: entrypoint module
export {
  type AddChainErrorType,
  type AddChainParameters,
  addChain,
} from './wallet/addChain.js'
export {
  type FetchAccountErrorType,
  type FetchAccountParameters,
  type FetchAccountReturnType,
  fetchAccount,
} from './public/fetchAccount.js'
export {
  type GetBalanceErrorType,
  type GetBalanceParameters,
  type GetBalanceReturnType,
  getBalance,
} from './public/getBalance.js'
export {
  type GetBlockHashErrorType,
  type GetBlockHashParameters,
  type GetBlockHashReturnType,
  getBlockHash,
} from './public/getBlockHash.js'
export {
  type GetNetworkIdErrorType,
  type GetNetworkIdReturnType,
  getNetworkId,
} from './public/getNetworkId.js'
export {
  type GetTransactionCountErrorType,
  type GetTransactionCountParameters,
  type GetTransactionCountReturnType,
  getTransactionCount,
} from './public/getTransactionCount.js'
export {
  type OnBlockHashFn,
  type OnBlockHashParameter,
  type WatchBlockHashErrorType,
  type WatchBlockHashParameters,
  type WatchBlockHashReturnType,
  watchBlockHash,
} from './public/watchBlockHash.js'
export {
  type GetAddressesErrorType,
  type GetAddressesReturnType,
  getAddresses,
} from './wallet/getAddresses.js'
export {
  type GetPermissionsErrorType,
  type GetPermissionsReturnType,
  getPermissions,
} from './wallet/getPermissions.js'
export {
  type RequestAddressesErrorType,
  type RequestAddressesReturnType,
  requestAddresses,
} from './wallet/requestAddresses.js'
export {
  type RequestPermissionsErrorType,
  type RequestPermissionsReturnType,
  type RequestPermissionsParameters,
  requestPermissions,
} from './wallet/requestPermissions.js'
export {
  type SendSignedTransactionErrorType,
  type SendSignedTransactionParameters,
  type SendSignedTransactionReturnType,
  sendSignedTransaction,
} from './wallet/sendSignedTransaction.js'
export {
  type SendTransactionErrorType,
  type SendTransactionParameters,
  type SendTransactionReturnType,
  sendTransaction,
} from './wallet/sendTransaction.js'
export {
  type SignTransactionErrorType,
  type SignTransactionParameters,
  type SignTransactionReturnType,
  signTransaction,
} from './wallet/signTransaction.js'
export {
  type SwitchChainErrorType,
  type SwitchChainParameters,
  switchChain,
} from './wallet/switchChain.js'
