import { Icon, List } from '@raycast/api'

import { encode } from 'gpt-3-encoder'
import { useState } from 'react'
import { useMount, useUpdateEffect } from 'react-use'

import { useStore } from '@/Store'
import Actions from '@/components/Actions'

export default function Prompt() {
  const { currentPrompt, loading } = useStore()
  const [tokens, setTokens] = useState(0)

  function getTitle() {
    if (currentPrompt.length === 0) {
      return ''
    } else if (loading) {
      return 'Loading...'
    } else {
      return 'Submit'
    }
  }

  function getAccessories() {
    if (currentPrompt.length === 0) {
      return []
    } else if (loading) {
      return []
    } else {
      return [{ text: `${tokens} tokens` }]
    }
  }

  function updateTokens(text: string) {
    const tokens = encode(text)
    setTokens(tokens.length)
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
      title={getTitle()}
      subtitle={currentPrompt.length === 0 ? 'Submit' : ''}
      accessories={getAccessories()}
      actions={<Actions type="prompt" />}
    />
  )
}
