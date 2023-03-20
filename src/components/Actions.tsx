import { ActionPanel, Action, showToast, Clipboard, Icon } from '@raycast/api'

import { updateState, useStore } from '@/Store'
import useCompletion from '@/hooks/useCompletion'

type PromptActionProps = {
  type: 'prompt'
}
type MessageActionProps = {
  type: 'message'
  content: string
}

type ActionProps = PromptActionProps | MessageActionProps

export default function Actions(props: ActionProps) {
  const { currentPrompt, chatMessages } = useStore()
  const { chatCompletion } = useCompletion()

  async function submitPrompt() {
    console.log('submitPrompt', currentPrompt)
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

  return (
    <ActionPanel>
      {props.type === 'prompt' && currentPrompt.length > 0 && (
        <Action
          title="Submit Prompt"
          icon={Icon.Rocket}
          onAction={submitPrompt}
        />
      )}

      {props.type === 'message' && (
        <>
          <Action
            title="Copy Text"
            icon={Icon.CopyClipboard}
            onAction={() => copy(props.content)}
          />

          {chatMessages.length > 0 && (
            <Action
              title="Clear Conversation"
              icon={Icon.Trash}
              onAction={clear}
            />
          )}
        </>
      )}
    </ActionPanel>
  )
}
