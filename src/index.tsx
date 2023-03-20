import { Icon, LaunchProps, List } from '@raycast/api'

import { useStore } from '@/Store'
import Actions from '@/components/Actions'

type CommandProps = {
  prompt: string
}

export default function Command(
  props: LaunchProps<{ arguments: CommandProps }>
) {
  const { prompt: defaultPrompt } = props.arguments
  const { currentPrompt, setCurrentPrompt } = useStore()

  function onSearchTextChange(text: string) {
    console.log('onSearchTextChange', text)
    setCurrentPrompt(text)
  }

  return (
    <List
      filtering={false}
      searchBarPlaceholder="Your prompt here"
      onSearchTextChange={onSearchTextChange}
      searchText={currentPrompt}
    >
      <List.Item
        title={defaultPrompt}
        icon={Icon.Circle}
        accessories={[{ text: 'xxx tokens' }]}
        actions={<Actions content={defaultPrompt} prompt={currentPrompt} />}
      />
      <List.Item
        title="test"
        icon={Icon.Circle}
        accessories={[{ text: 'xxx tokens' }]}
        actions={<Actions content="test" prompt={currentPrompt} />}
      />
    </List>
  )
}
