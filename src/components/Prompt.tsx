import { Icon, List } from '@raycast/api'

import { encode } from 'gpt-3-encoder'
import { useState } from 'react'
import { useMount, useUpdateEffect } from 'react-use'

import { useStore } from '@/Store'
import Actions from '@/components/Actions'

export default function Prompt() {
  const { currentPrompt } = useStore()
  const [tokens, setTokens] = useState(0)

  function updateTokens(text: string) {
    const tokens = encode(text)
    setTokens(tokens.length)
    console.log('updateTokens', tokens.length)
  }

  useMount(() => {
    updateTokens(currentPrompt)
  })

  useUpdateEffect(() => {
    updateTokens(currentPrompt)
  }, [currentPrompt])

  return (
    <List.Item
      id="prompt"
      icon={Icon.Bubble}
      title={currentPrompt}
      accessories={[{ text: `${tokens}`, tooltip: `${tokens} tokens` }]}
      actions={<Actions type="prompt" />}
    />
  )
}
