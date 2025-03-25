import { defineChain } from '../../utils/chain/defineChain.js'

export const lightnet = /*#__PURE__*/ defineChain({
  id: 'testnet',
  name: 'Lightnet',
  nativeCurrency: { name: 'MINA', symbol: 'MINA', decimals: 9 },
  rpcUrls: {
    default: {
      http: ['http://localhost:8080/graphql'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Lightnet Explorer',
      url: '',
    },
  },
})
