import { getPreferenceValues, LaunchProps, List } from '@raycast/api'

import { useState } from 'react'
import { useMount, useUpdateEffect } from 'react-use'

import { useStore, updateState, loadState } from '@/Store'
import Actions from '@/components/Actions'
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
  const { currentPrompt, chatMessages, loading, totalTokens, selectedItemId } =
    useStore()
  const { chatCompletion } = useCompletion()
  const preferences = getPreferenceValues<Preferences>()

  function onSearchTextChange(text: string) {
    console.log('onSearchTextChange', text)
    updateState({ currentPrompt: text })

    if (text.length > 0) {
      if (preferences.imeFix) {
        updateState({ selectedItemId: 'dummyPrompt' })
      } else {
        updateState({ selectedItemId: 'prompt' })
      }
    }
  }

  useMount(async () => {
    console.log('index mounted', defaultPrompt)

    await loadState()

    if (defaultPrompt) {
      await chatCompletion(defaultPrompt)
    } else {
      onSearchTextChange('')
    }
  })

  return (
    <List
      filtering={false}
      searchBarPlaceholder="Your prompt here"
      onSearchTextChange={onSearchTextChange}
      searchText={currentPrompt}
      isShowingDetail={chatMessages.length > 0}
      isLoading={loading}
      selectedItemId={selectedItemId}
      navigationTitle={`ChatGPT (Model: ${preferences.model})`}
    >
      {/* prompt */}
      {preferences.imeFix ? (
        <>
          <List.Item
            title=""
            subtitle="Prompt"
            id="dummyPrompt"
            actions={<Actions type="dummyPrompt" />}
          />
          <Prompt />
        </>
      ) : (
        <List.Section title="Prompt">
          <Prompt />
        </List.Section>
      )}

      {/* messages */}
      {chatMessages.length > 0 && (
        <List.Section title={`Messages (Total: ${totalTokens} tokens)`}>
          {[...chatMessages].reverse().map((message, index) => (
            <Message key={index} index={index} message={message} />
          ))}
        </List.Section>
      )}
    </List>
  )
}
