import { http, createPublicClient, webSocket } from 'vimina'
import { mainnet } from 'vimina/chains'
import { Client } from './client'

export default async function Home() {
  const client = createPublicClient({
    chain: mainnet,
    transport: http('https://mainnet.klesia.palladians.xyz/api'),
  })

  await client.getBlockHash()

  return (
    <>
      <div>server: success</div>
      <Client />
    </>
  )
}
