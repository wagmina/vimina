const { http, createPublicClient } = require('vimina')
const { mainnet } = require('vimina/chains')

const client = createPublicClient({
  chain: mainnet,
  transport: http('https://mainnet.klesia.palladians.xyz/api'),
})
;(async () => {
  await client.getBlockHash()

  process.exit(0)
})()
