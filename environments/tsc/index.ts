import { http, createPublicClient } from 'vimina'
import { mainnet } from 'vimina/chains'
;(async () => {
  const client = createPublicClient({
    chain: mainnet,
    transport: http('https://api.minascan.io/node/mainnet/v1/graphql'),
  })

  await client.getBlockHash()

  process.exit(0)
})()
