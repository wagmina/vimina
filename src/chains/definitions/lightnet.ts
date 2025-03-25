import { defineChain } from '../../utils/chain/defineChain.js'

export const devnet = /*#__PURE__*/ defineChain({
  id: 'devnet',
  name: 'Mina Devnet',
  nativeCurrency: { name: 'MINA', symbol: 'MINA', decimals: 9 },
  rpcUrls: {
    default: {
      graphql: ['http://localhost:8080/graphql'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Minascan',
      url: 'https://minascan.io/devnet',
    },
  },
  graphqlEndpoint: 'http://localhost:8080/graphql',
})
