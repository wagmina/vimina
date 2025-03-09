import type { Address } from '../accounts/index.js'

export type ErrorType<name extends string = 'Error'> = Error & { name: name }

export const getContractAddress = (address: Address) => address
export const getUrl = (url: string) => url
