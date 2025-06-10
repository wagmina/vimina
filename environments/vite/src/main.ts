import { http, createPublicClient } from 'vimina'
import { mainnet } from 'vimina/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http('https://api.minascan.io/node/mainnet/v1/graphql'),
})

await client.getBlockHash()

document.getElementById('app')!.innerText = 'success'
