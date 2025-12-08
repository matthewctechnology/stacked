import { describe, expect, test } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useChatReducer } from '../../src/app/useChatReducer';


describe('useChatReducer', () => {
  test('should initialize with empty state', () => {
    const { result } = renderHook(() => useChatReducer());

    expect(result.current.state.input).toBe('');
    expect(result.current.state.messages).toEqual([]);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBeNull();
  });

  test('should update input on INPUT_CHANGE', () => {
    const { result } = renderHook(() => useChatReducer());
    act(() => {
      result.current.dispatch({ type: 'INPUT_CHANGE', value: 'test' });
    });

    expect(result.current.state.input).toBe('test');
  });

  test('should set loading and add user message on SUBMIT', () => {
    const { result } = renderHook(() => useChatReducer());
    act(() => {
      result.current.dispatch({ type: 'INPUT_CHANGE', value: 'idea' });
      result.current.dispatch({ type: 'SUBMIT' });
    });

    expect(result.current.state.loading).toBe(true);
    expect(result.current.state.messages).toEqual([{ role: 'user', text: 'idea' }]);
  });

  test('should add AI response on RESPONSE', () => {
    const { result } = renderHook(() => useChatReducer());
    act(() => {
      result.current.dispatch({ type: 'INPUT_CHANGE', value: 'idea' });
      result.current.dispatch({ type: 'SUBMIT' });
      result.current.dispatch({ type: 'RESPONSE', value: 'AI reply' });
    });

    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.messages).toEqual([
      { role: 'user', text: 'idea' },
      { role: 'ai', text: 'AI reply' }
    ]);
  });

  test('should set error on ERROR', () => {
    const { result } = renderHook(() => useChatReducer());
    act(() => {
      result.current.dispatch({ type: 'ERROR', value: 'error' });
    });

    expect(result.current.state.error).toBe('error');
    expect(result.current.state.loading).toBe(false);
  });

  test('should reset state on RESET', () => {
    const { result } = renderHook(() => useChatReducer());
    act(() => {
      result.current.dispatch({ type: 'INPUT_CHANGE', value: 'idea' });
      result.current.dispatch({ type: 'SUBMIT' });
      result.current.dispatch({ type: 'RESET' });
    });

    expect(result.current.state.input).toBe('');
    expect(result.current.state.messages).toEqual([]);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBeNull();
  });

  test('should simulate AI response as a string', () => {
    const { result } = renderHook(() => useChatReducer());
    const response = result.current.simulateAIResponse();

    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
  });
});
