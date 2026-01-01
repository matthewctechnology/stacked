import { describe, expect, jest, test } from '@jest/globals';
import Home from '../../src/app/page';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';


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
    const expected = 'enter an idea';
    const received = screen.getByPlaceholderText(expected).getAttribute('placeholder');

    expect(received).toEqual(expected);
  });

  test('should display submit button', () => {
    render(<Home />);
    const expected = 'submit';
    const received = screen.getByRole('button', { name: 'submit' }).textContent;

    expect(received).toEqual(expected);
  });

  test('should display disclaimer', () => {
    render(<Home />);
    const expected = 'unvalidated responses inferred at individual risk';
    const received = screen.queryByText(expected)?.textContent;

    expect(received).toEqual(expected);
  });

  test('should display thinking while loading', async () => {
    render(<Home />);
    const inputField = screen.getByPlaceholderText('enter an idea');
    const button = screen.getByRole('button', { name: 'submit' });

    await userEvent.type(inputField, 'an idea');
    fireEvent.click(button);

    expect(screen.queryByText('thinking...')).not.toBeNull();
    await waitFor(() => {
      expect(screen.queryByText('thinking...')).toBeNull();
    });
  });

  test('should display user and AI messages', async () => {
    render(<Home />);
    const inputField = screen.getByPlaceholderText('enter an idea');
    const button = screen.getByRole('button', { name: 'submit' });

    await userEvent.type(inputField, 'an idea');
    fireEvent.click(button);

    expect(screen.getByTestId('user').textContent).toBe('an idea');
    await waitFor(() => {
      expect(screen.getByTestId('ai')).not.toBeNull();
    });
  });

  test('should clear text input on submit', async () => {
    render(<Home />);
    const inputField = screen.getByPlaceholderText('enter an idea');
    const button = screen.getByRole('button', { name: 'submit' });

    await userEvent.type(inputField, 'another idea');
    fireEvent.click(button);

    await waitFor(() => {
      expect(inputField.textContent).toBe('');
      expect(inputField.textContent).not.toBe('another idea');
    });
  });

  test('should disable submit for empty input', async () => {
    render(<Home />);
    const inputField = screen.getByPlaceholderText('enter an idea');
    const button = screen.getByRole('button', { name: 'submit' }) as HTMLButtonElement;

    await userEvent.type(inputField, ' ');
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('title')).toBe('input empty');
  });

  test('should disable submit for invalid input', async () => {
    render(<Home />);
    const inputField = screen.getByPlaceholderText('enter an idea');
    const button = screen.getByRole('button', { name: 'submit' }) as HTMLButtonElement;

    await userEvent.type(inputField, 'a'.repeat(257));
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('title')).toBe('input too long');
  });

  test('should throttle submissions to 1 per 30 seconds', async () => {
    render(<Home />);
    const inputField = screen.getByPlaceholderText('enter an idea') as HTMLInputElement;
    const button = screen.getByRole('button', { name: 'submit' });

    await userEvent.type(inputField, 'first idea');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('ai')).not.toBeNull();
    });

    await userEvent.type(inputField, 'second idea');
    fireEvent.click(button);

    expect(button.getAttribute('title')).toMatch(/please wait/i);

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
      expect(screen.getByTestId('ai')).not.toBeNull();
    });

    now += 31_000;
    jest.spyOn(Date, 'now').mockImplementation(() => now);

    await userEvent.type(inputField, 'second');
    fireEvent.click(button);

    await waitFor(() => {
      expect(inputField.value).toBe('');
    });

    expect(screen.getByTestId('user').textContent).toBe('second');
    await waitFor(() => {
      expect(screen.getByTestId('ai')).not.toBeNull();
    });
    jest.restoreAllMocks();
  });
});
