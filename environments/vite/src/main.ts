import { http, createPublicClient } from 'vimina'
import { mainnet } from 'vimina/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http('https://mainnet.klesia.palladians.xyz/api'),
})

await client.getBlockHash()

document.getElementById('app')!.innerText = 'success'
