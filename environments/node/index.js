const { http, createPublicClient } = require('vimina')
const { mainnet } = require('vimina/chains')

const client = createPublicClient({
  chain: mainnet,
  transport: http('https://api.minascan.io/node/mainnet/v1/graphql'),
})
;(async () => {
  await client.getBlockHash()

  process.exit(0)
})()
