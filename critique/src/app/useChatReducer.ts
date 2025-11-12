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

const AI_RESPONSES = [
  'That is a novel idea with potential!',
  'Consider refining your concept for more impact.',
  'This proposal is viable and valuable.',
  'Try to clarify your main objective.',
  'Interesting! What an inspired idea.'
];

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

  const simulateAIResponse = () => {
    const random = Math.floor(Math.random() * AI_RESPONSES.length);
    return AI_RESPONSES[random];
  };

  return { state, dispatch, simulateAIResponse };
}
