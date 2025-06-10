'use client'

import { useEffect, useState } from 'react'
import { http, createPublicClient } from 'vimina'
import { mainnet } from 'vimina/chains'

export function Client() {
  const [success, setSuccess] = useState<boolean | undefined>()
  useEffect(() => {
    ;(async () => {
      const client = createPublicClient({
        chain: mainnet,
        transport: http('https://api.minascan.io/node/mainnet/v1/graphql'),
      })

      await client.getBlockHash()

      setSuccess(true)
    })()
  }, [])
  return <div>client: {success ? 'success' : ''}</div>
}
