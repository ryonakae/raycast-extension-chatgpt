import { Icon, List } from '@raycast/api'

import { encode } from 'gpt-3-encoder'
import { useState } from 'react'
import { useMount, useUpdateEffect } from 'react-use'

import Actions from '@/components/Actions'
import { ChatMessage } from '@/types'

type MessageProps = {
  index: number
  message: ChatMessage
}

export default function Message({ index, message }: MessageProps) {
  const [tokens, setTokens] = useState(0)

  function getName(role: ChatMessage['role']) {
    if (role === 'user') {
      return 'You'
    } else if (role === 'assistant') {
      return 'ChatGPT'
    } else {
      return ''
    }
  }

  function getListIcon(role: ChatMessage['role']) {
    if (role === 'user') {
      return Icon.Person
    } else if (role === 'assistant') {
      return Icon.Keyboard
    } else {
      return Icon.Circle
    }
  }

  function updateTokens(text: string) {
    const tokens = encode(text)
    setTokens(tokens.length)
  }

  useMount(() => {
    setTimeout(() => {
      updateTokens(message.content)
    }, 100)
  })

  useUpdateEffect(() => {
    updateTokens(message.content)
  }, [message.content])

  return (
    <List.Item
      id={`message-${index}`}
      title={getName(message.role)}
      icon={getListIcon(message.role)}
      subtitle={message.content}
      // accessories={[{ text: `${tokens}`, tooltip: `${tokens} tokens` }]}
      detail={<List.Item.Detail markdown={message.content} />}
      actions={<Actions type="message" content={message.content} />}
    />
  )
}
