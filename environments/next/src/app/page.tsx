import { http, createPublicClient, webSocket } from 'vimina'
import { mainnet } from 'vimina/chains'
import { Client } from './client'

export default async function Home() {
  const client = createPublicClient({
    chain: mainnet,
    transport: http('https://api.minascan.io/node/mainnet/v1/graphql'),
  })

  await client.getBlockHash()

  return (
    <>
      <div>server: success</div>
      <Client />
    </>
  )
}
