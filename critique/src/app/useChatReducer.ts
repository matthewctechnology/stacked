import { fallbackResponseProvider } from '../../src/app/fallbackResponses';
import { useReducer, Dispatch } from 'react';

/**
 * Represents a chat message from the user or AI.
 */
type Message = {
  role: 'user' | 'ai';
  text: string;
};

/**
 * State for the chat reducer.
 */
type ChatState = {
  input: string;
  messages: Message[];
  loading: boolean;
  error: string | null;
};

/**
 * Actions for the chat reducer.
 */
type ChatAction =
  | { type: 'INPUT_CHANGE'; value: string }
  | { type: 'SUBMIT' }
  | { type: 'RESPONSE'; value: string }
  | { type: 'ERROR'; value: string }
  | { type: 'RESET' };

export interface UseChatReducerResult {
  state: ChatState;
  dispatch: Dispatch<ChatAction>;
  fetchAIResponse: (input: string) => Promise<string>;
  fallbackResponse: () => Promise<string>;
}

const initialState: ChatState = {
  input: '',
  messages: [],
  loading: false,
  error: null
};

/**
 * Reducer function for chat state management.
 * @param state - Current chat state
 * @param action - Action to perform
 * @returns Updated chat state
 */
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'INPUT_CHANGE':
      return { ...state, input: action.value, error: null };
    case 'SUBMIT':
      return {
        ...state,
        input: '',
        loading: true,
        messages: [{ role: 'user', text: state.input }],
        error: null
      };
    case 'RESPONSE':
      return {
        ...state,
        loading: false,
        messages: [
          ...state.messages,
          { role: 'ai', text: action.value }
        ]
      };
    case 'ERROR':
      return { ...state, loading: false, error: action.value };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

/**
 * Custom React hook for managing chat state and AI/fallback responses.
 * @returns Chat state, dispatch function, fetchAIResponse, and fallbackResponse
 */
export function useChatReducer(): UseChatReducerResult {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  /**
   * Returns a static fallback response after a short delay.
   * @returns Promise<string> fallback response
   */
  const fallbackResponse = async () => {
    await delay(800);
    return fallbackResponseProvider.getResponse();
  };

  /**
   * Fetches an AI critique response from the API, or falls back to static response on error.
   * @param input - User input string
   * @returns Promise<string> AI or fallback response
   */
  const fetchAIResponse = async (input: string): Promise<string> => {
    try {
      const res = await fetch('/api/critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'API unavailable');
      }
      const data = await res.json();
      if (data.message) return data.message;
      throw new Error(data.error || 'AI error');
    } catch (err) {
      if (err) err = `Static Fallback: ${err}`;

      return fallbackResponse();
    }
  };

  return { state, dispatch, fetchAIResponse, fallbackResponse };
}
