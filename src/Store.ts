import { create } from 'zustand'

type State = {
  currentPrompt: string
  setCurrentPrompt: (prompt: string) => void
}

export const useStore = create<State>(set => ({
  currentPrompt: '',
  setCurrentPrompt: (prompt: string) =>
    set(state => ({
      currentPrompt: prompt,
    })),
}))
