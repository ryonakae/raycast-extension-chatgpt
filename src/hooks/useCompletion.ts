import { getPreferenceValues, showToast, Toast } from '@raycast/api'

import fetch from 'cross-fetch'
import { dropRight } from 'lodash'

import { useStore, updateState } from '@/Store'
import {
  ChatMessage,
  OpenAiApiChatRequest,
  OpenAiApiChatResponse,
  OpenAiApiError,
  Preferences,
} from '@/types'

export default function useCompletion() {
  const { currentPrompt } = useStore()
  const preferences = getPreferenceValues<Preferences>()

  async function chatCompletion(prompt: string) {
    console.log('chatCompletion', currentPrompt, preferences)

    updateState({ loading: true })

    const chatMessages = useStore.getState().chatMessages
    const message: ChatMessage = {
      role: 'user',
      content: prompt,
    }
    const messages: ChatMessage[] = [...chatMessages, message]

    updateState({
      chatMessages: messages,
    })

    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${preferences.apiKey}`,
      },
      body: JSON.stringify({
        model: preferences.model,
        messages: messages,
        temperature: Number(preferences.temperature),
        max_tokens: Number(preferences.maxTokens),
        stop: preferences.stop,
        top_p: Number(preferences.topP),
        frequency_penalty: Number(preferences.frequencyPenalty),
        presence_penalty: Number(preferences.presencePenalty),
      } as OpenAiApiChatRequest),
    })
      .then(async response => {
        console.log('then')

        // エラーコードが返って来た場合、エラーを投げる（catchに書いている処理を実行）
        if (!response.ok) {
          console.error('response.ok:', response.ok)
          console.error('response.status:', response.status)

          // chatMessagesの最後の要素（リクエスト前に追加したメッセージ）を削除
          updateState({
            chatMessages: dropRight(useStore.getState().chatMessages),
          })

          const data = (await response.json()) as OpenAiApiError
          throw new Error(data.error.message) // 以降の処理は中断される、catch(の処理が実行される)
        }

        // 成功時の処理
        const data = (await response.json()) as OpenAiApiChatResponse
        console.log(data)

        updateState({
          currentPrompt: '', // promptをクリア
          chatMessages: [
            ...useStore.getState().chatMessages, // 最新のstateを取ってこないと人間のメッセージが上書きされてしまう
            {
              role: 'assistant',
              content: data.choices[0].message.content.trim(),
            },
          ],
          totalTokens: data.usage.total_tokens,
        })
      })
      .catch(async (err: Error) => {
        console.log('err', err.message)
        await showToast({
          style: Toast.Style.Failure,
          title: 'Error.',
          message: err.message,
        })
      })
      .finally(() => {
        console.log('finally')
        updateState({ loading: false })
      })
  }

  return { chatCompletion }
}