import { expect, test } from 'vitest'

import { poll } from './poll.js'
import { wait } from './wait.js'

test('polls on a given interval', async () => {
  const items: string[] = []
  poll(
    async () => {
      items.push('wagmina')
    },
    {
      interval: 100,
    },
  )

  await wait(450)
  expect(items).toMatchInlineSnapshot(`
    [
      "wagmina",
      "wagmina",
      "wagmina",
      "wagmina",
    ]
  `)
})

test('emitOnBegin', async () => {
  const items: string[] = []
  poll(
    async () => {
      items.push('wagmina')
    },
    {
      emitOnBegin: true,
      interval: 100,
    },
  )

  await wait(500)
  expect(items).toMatchInlineSnapshot(`
    [
      "wagmina",
      "wagmina",
      "wagmina",
      "wagmina",
      "wagmina",
    ]
  `)
})

test('initialWaitTime', async () => {
  const items: string[] = []
  poll(
    async () => {
      items.push('wagmina')
    },
    {
      initialWaitTime: async () => 200,
      interval: 100,
    },
  )

  await wait(500)
  expect(items).toMatchInlineSnapshot(`
    [
      "wagmina",
      "wagmina",
      "wagmina",
    ]
  `)
})

test('stop polling', async () => {
  const items: string[] = []
  const unpoll = poll(
    async () => {
      items.push('wagmina')
    },
    {
      interval: 100,
    },
  )

  await wait(500)
  expect(items).toMatchInlineSnapshot(`
    [
      "wagmina",
      "wagmina",
      "wagmina",
      "wagmina",
    ]
  `)

  unpoll()

  await wait(500)
  expect(items).toMatchInlineSnapshot(`
    [
      "wagmina",
      "wagmina",
      "wagmina",
      "wagmina",
    ]
  `)
})

test('stop polling via callback', async () => {
  const items: string[] = []
  poll(
    async ({ unpoll }) => {
      items.push('wagmina')
      if (items.length === 2) unpoll()
    },
    {
      interval: 100,
    },
  )

  await wait(500)
  expect(items).toMatchInlineSnapshot(`
    [
      "wagmina",
      "wagmina",
    ]
  `)
})
