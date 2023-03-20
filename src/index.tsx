import { getPreferenceValues, Icon, LaunchProps, List } from '@raycast/api'

import { useState } from 'react'
import { useMount, useUpdateEffect } from 'react-use'

import { useStore, updateState, loadState } from '@/Store'
import Message from '@/components/Message'
import Prompt from '@/components/Prompt'
import useCompletion from '@/hooks/useCompletion'
import { Preferences } from '@/types'

type CommandProps = {
  prompt?: string
}

export default function Command(
  props: LaunchProps<{ arguments: CommandProps }>
) {
  const { prompt: defaultPrompt } = props.arguments
  const { currentPrompt, chatMessages, loading, lastSelectedItemIndex } =
    useStore()
  const { chatCompletion } = useCompletion()
  const [selectedItemId, setSelectedItemId] = useState('')
  const preferences = getPreferenceValues<Preferences>()

  function onSearchTextChange(text: string) {
    console.log('onSearchTextChange', text)
    updateState({ currentPrompt: text })

    if (text.length > 0) {
      console.log('prompt selected')
      setSelectedItemId('prompt')
    }
  }

  useMount(async () => {
    console.log('index mounted', defaultPrompt)

    await loadState()

    setSelectedItemId(String(lastSelectedItemIndex))

    if (defaultPrompt) {
      await chatCompletion(defaultPrompt)
    }
  })

  useUpdateEffect(() => {
    updateState({ lastSelectedItemIndex: chatMessages.length - 1 })
  }, [chatMessages, lastSelectedItemIndex])

  useUpdateEffect(() => {
    setSelectedItemId(String(lastSelectedItemIndex))
  }, [lastSelectedItemIndex])

  return (
    <List
      filtering={false}
      searchBarPlaceholder="Your prompt here"
      onSearchTextChange={onSearchTextChange}
      searchText={currentPrompt}
      isShowingDetail
      isLoading={loading}
      selectedItemId={selectedItemId}
      navigationTitle={`ChatGPT (Model: ${preferences.model})`}
    >
      {/* prompt */}
      <List.Section title="Prompt">
        <Prompt />
      </List.Section>

      {/* messages */}
      {chatMessages.length > 0 && (
        <List.Section title="Messages">
          {chatMessages.map((message, index) => (
            <Message key={index} index={index} message={message} />
          ))}
        </List.Section>
      )}

      {/* empty */}
      {chatMessages.length === 0 && (
        <List.EmptyView icon={Icon.Message} title="Let's start a chat!" />
      )}
    </List>
  )
}
