import {
  ActionPanel,
  Action,
  showToast,
  Clipboard,
  Icon,
  getPreferenceValues,
} from '@raycast/api'

import { updateState, useStore } from '@/Store'
import useCompletion from '@/hooks/useCompletion'
import { Preferences } from '@/types'

type PromptActionProps = {
  type: 'prompt' | 'dummyPrompt'
}
type MessageActionProps = {
  type: 'message'
  content: string
}

type ActionProps = PromptActionProps | MessageActionProps

export default function Actions(props: ActionProps) {
  const { currentPrompt, chatMessages } = useStore()
  const { chatCompletion } = useCompletion()
  const preferences = getPreferenceValues<Preferences>()

  async function submitPrompt() {
    console.log('submitPrompt', currentPrompt)

    if (preferences.imeFix) {
      updateState({ selectedItemId: 'prompt' })
    }

    await chatCompletion(currentPrompt)
  }

  async function clear() {
    console.log('clear')
    updateState({
      chatMessages: [],
      totalTokens: 0,
    })
    await showToast({ title: 'Conversation cleared.' })
  }

  async function copy(text: string) {
    console.log('copy', text)
    await Clipboard.copy(text)
    await showToast({ title: 'Copied to clipboard.' })
  }

  function focusToPrompt() {
    console.log('focusToPrompt')

    updateState({ selectedItemId: '' })

    setTimeout(() => {
      if (preferences.imeFix) {
        updateState({ selectedItemId: 'dummyPrompt' })
      } else {
        updateState({ selectedItemId: 'prompt' })
      }
    }, 100)
  }

  return (
    <ActionPanel>
      {props.type === 'dummyPrompt' && currentPrompt.length > 0 && (
        <>
          {preferences.imeFix && <Action title="" />}

          <Action
            title="Submit Prompt"
            icon={Icon.Rocket}
            onAction={submitPrompt}
            shortcut={{ modifiers: ['cmd'], key: 'enter' }}
          />
        </>
      )}

      {props.type === 'prompt' && currentPrompt.length > 0 && (
        <Action
          title="Submit Prompt"
          icon={Icon.Rocket}
          onAction={submitPrompt}
          shortcut={{ modifiers: ['cmd'], key: 'enter' }}
        />
      )}

      {props.type === 'message' && (
        <>
          {preferences.imeFix && (
            <Action
              title="Focus to Prompt"
              icon={Icon.Bubble}
              onAction={focusToPrompt}
              shortcut={{ modifiers: ['cmd'], key: 'l' }}
            />
          )}

          <Action
            title="Copy Text"
            icon={Icon.CopyClipboard}
            onAction={() => copy(props.content)}
            shortcut={{ modifiers: ['cmd'], key: 'c' }}
          />

          {chatMessages.length > 0 && (
            <Action
              title="Clear Conversation"
              icon={Icon.Trash}
              onAction={clear}
              style={Action.Style.Destructive}
            />
          )}
        </>
      )}
    </ActionPanel>
  )
}
