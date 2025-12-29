import { fallbackResponseProvider } from '../../src/app/fallbackResponses';
import { useReducer } from 'react';


type Message = {
  role: 'user' | 'ai';
  text: string;
};

type ChatState = {
  input: string;
  messages: Message[];
  loading: boolean;
  error: string | null;
};

type ChatAction =
  | { type: 'INPUT_CHANGE'; value: string }
  | { type: 'SUBMIT' }
  | { type: 'RESPONSE'; value: string }
  | { type: 'ERROR'; value: string }
  | { type: 'RESET' };

const initialState: ChatState = {
  input: '',
  messages: [],
  loading: false,
  error: null
};

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

export function useChatReducer() {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const fallbackResponse = async () => {
    await delay(800);
    return fallbackResponseProvider.getResponse();
  };

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
