import { describe, jest, test } from '@jest/globals';
import Home from '../../src/app/page';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import '@testing-library/jest-dom';


jest.mock('../../src/app/useChatReducer', () => {
  type ChatAction = {
    type: string
    value: string
  }
  type ChatState = {
    input: string
    messages: Array<object>,
    loading: boolean,
    error: null | string,
  };
  let state: ChatState = {
    input: '',
    messages: [],
    loading: false,
    error: null,
  };
  const listeners: Array<() => void> = [];
  return {
    useChatReducer: () => ({
      state,
      dispatch: (action: ChatAction) => {
        if (action.type === 'INPUT_CHANGE') {
          state = { ...state, input: action.value, error: null };
        } else if (action.type === 'SUBMIT') {
          state = {
            ...state,
            input: '',
            loading: true,
            messages: [{ role: 'user', text: state.input }] as never,
            error: null
          };
        } else if (action.type === 'RESPONSE') {
          state = {
            ...state,
            loading: false,
            messages: [...state.messages, { role: 'ai', text: action.value }] as never
          };
        } else if (action.type === 'ERROR') {
          state = { ...state, loading: false, error: action.value };
        } else if (action.type === 'RESET') {
          state = {
            input: '',
            messages: [],
            loading: false,
            error: null
          };
        }
        listeners.forEach(fn => fn());
      },
      fetchAIResponse: async () => 'Mocked AI',
      fallbackResponse: async () => 'Mocked fallback'
    })
  };
});

describe('Home', () => {
  test('should display input field', () => {
    render(<Home />);
    const input = screen.getByPlaceholderText('enter an idea');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'enter an idea');
  });

  test('should display submit button', () => {
    render(<Home />);
    const button = screen.getByRole('button', { name: 'submit' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('submit');
  });

  test('should display disclaimer', () => {
    render(<Home />);
    const disclaimer = screen.getByText('unvalidated responses inferred at individual risk');
    expect(disclaimer).toBeInTheDocument();
  });

  test('should display thinking while loading', async () => {
    render(<Home />);
    const inputField = screen.getByPlaceholderText('enter an idea');
    const button = screen.getByRole('button', { name: 'submit' });

    await userEvent.type(inputField, 'an idea');
    fireEvent.click(button);

    expect(screen.getByText('thinking...')).toBeVisible();
    await waitFor(() => {
      expect(screen.queryByText('thinking...')).not.toBeInTheDocument();
    });
  });

  test('should display user and AI messages', async () => {
    render(<Home />);
    const inputField = screen.getByPlaceholderText('enter an idea');
    const button = screen.getByRole('button', { name: 'submit' });

    await userEvent.type(inputField, 'an idea');
    fireEvent.click(button);

    expect(screen.getByTestId('user')).toHaveTextContent('an idea');
    await waitFor(() => {
      expect(screen.getByTestId('ai')).toBeInTheDocument();
    });
  });

  test('should clear text input on submit', async () => {
    render(<Home />);
    const inputField = screen.getByPlaceholderText('enter an idea');
    const button = screen.getByRole('button', { name: 'submit' });

    await userEvent.type(inputField, 'another idea');
    fireEvent.click(button);

    await waitFor(() => {
      expect(inputField).toHaveValue('');
    });
  });

  test('should disable submit for empty input', async () => {
    render(<Home />);
    const inputField = screen.getByPlaceholderText('enter an idea');
    const button = screen.getByRole('button', { name: 'submit' }) as HTMLButtonElement;

    await userEvent.type(inputField, ' ');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('title', 'input empty');
  });

  test('should disable submit for invalid input', async () => {
    render(<Home />);
    const inputField = screen.getByPlaceholderText('enter an idea');
    const button = screen.getByRole('button', { name: 'submit' }) as HTMLButtonElement;

    await userEvent.type(inputField, 'a'.repeat(257));
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('title', 'input too long');
  });

  test('should throttle submissions to 1 per 30 seconds', async () => {
    render(<Home />);
    const inputField = screen.getByPlaceholderText('enter an idea') as HTMLInputElement;
    const button = screen.getByRole('button', { name: 'submit' });

    await userEvent.type(inputField, 'first idea');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('ai')).toBeInTheDocument();
    });

    await userEvent.type(inputField, 'second idea');
    fireEvent.click(button);

    expect(button).toHaveAttribute('title', expect.stringMatching(/please wait/i));

    jest.restoreAllMocks();
  });

  test('should clear chat and display new message on next submit', async () => {
    let now = Date.now();
    jest.spyOn(Date, 'now').mockImplementation(() => now);

    render(<Home />);
    const inputField = screen.getByPlaceholderText('enter an idea') as HTMLInputElement;
    const button = screen.getByRole('button', { name: 'submit' });

    await userEvent.type(inputField, 'first');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('ai')).toBeInTheDocument();
    });

    now += 31_000;
    jest.spyOn(Date, 'now').mockImplementation(() => now);

    await userEvent.type(inputField, 'second');
    fireEvent.click(button);

    await waitFor(() => {
      expect(inputField).toHaveValue('');
    });

    expect(screen.getByTestId('user')).toHaveTextContent('second');
    await waitFor(() => {
      expect(screen.getByTestId('ai')).toBeInTheDocument();
    });
    jest.restoreAllMocks();
  });
});
