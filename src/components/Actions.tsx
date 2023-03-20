import { ActionPanel, Action } from '@raycast/api'

import { useStore } from '@/Store'

type ActionProps = {
  prompt: string
  content: string
}

export default function Actions({ prompt, content }: ActionProps) {
  const { currentPrompt, setCurrentPrompt } = useStore()

  function onPromptSubmit() {
    console.log('onPromptSubmit', prompt)
    setCurrentPrompt('')
  }

  return (
    <ActionPanel>
      <Action title="Submit Prompt" onAction={onPromptSubmit} />
      <Action.CopyToClipboard title="Copy Text" content={content} />
    </ActionPanel>
  )
}
