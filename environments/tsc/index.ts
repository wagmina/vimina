import { http, createPublicClient } from 'vimina'
import { mainnet } from 'vimina/chains'
;(async () => {
  const client = createPublicClient({
    chain: mainnet,
    transport: http('https://mainnet.klesia.palladians.xyz/api'),
  })

  await client.getBlockHash()

  process.exit(0)
})()
