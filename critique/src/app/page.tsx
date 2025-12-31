'use client';

import { useEffect, useRef, useState } from 'react';
import { useChatReducer } from './useChatReducer';
import { validateInput } from './inputValidator';


interface ThrottleWindow extends Window {
  THROTTLE_MS?: number;
}

const getThrottleMs = (): number => {
  if (typeof window !== 'undefined' && typeof (window as ThrottleWindow).THROTTLE_MS === 'number') {
    return (window as ThrottleWindow).THROTTLE_MS!;
  }
  return 30_000;
};

export function Chat() {
  const { state, dispatch, fetchAIResponse } = useChatReducer();
  const validation = validateInput(state.input);
  const lastSubmitRef = useRef<number | null>(null);
  const [, forceUpdate] = useState(0);

  const THROTTLE_MS = getThrottleMs();

  const isThrottled =
    lastSubmitRef.current !== null &&
    Date.now() - lastSubmitRef.current < THROTTLE_MS;

  useEffect(() => {
    if (!isThrottled) return;
    const remaining = THROTTLE_MS - (Date.now() - (lastSubmitRef.current || 0));
    const timeout = setTimeout(() => forceUpdate(n => n + 1), remaining);
    return () => clearTimeout(timeout);
  }, [isThrottled, THROTTLE_MS]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'INPUT_CHANGE', value: e.target.value });
  };

  const handleSubmit = async () => {
    if (isThrottled) return;
    if (!validation.valid) {
      dispatch({ type: 'ERROR', value: validation.error || 'invalid input' });
      return;
    }
    lastSubmitRef.current = Date.now();
    forceUpdate(n => n + 1);

    dispatch({ type: 'SUBMIT' });

    const aiReply = await fetchAIResponse(state.input);
    dispatch({ type: 'RESPONSE', value: aiReply });
  };

  useEffect(() => {
    if (state.messages.length > 2) {
      dispatch({ type: 'RESET' });
    }
  }, [state.messages, dispatch]);

  return (
    <div>
      {state.error && (
        <p className="bg-red-100 text-red-700 font-mono font-semibold px-1 py-0.5 rounded">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-2 mb-2">
        {state.messages.map((msg, idx) => (
          <p
            key={idx}
            className={
              msg.role === 'user'
                ? 'bg-black/[.05] font-mono font-semibold px-1 py-0.5 rounded self-end'
                : 'bg-white text-black font-mono font-semibold px-1 py-0.5 rounded self-start'
            }
            data-testid={msg.role}
          >
            {msg.text}
          </p>
        ))}
        {state.loading && (
          <p className="bg-black/[.05] font-mono font-semibold px-1 py-0.5 rounded">
            thinking...
          </p>
        )}
      </div>

      <input
        className="bg-black/[.05] font-mono font-semibold px-1 py-0.5 rounded"
        type="text"
        placeholder="enter an idea"
        value={state.input}
        onChange={handleInputChange}
        disabled={state.loading}
        aria-label="idea-input"
      />
      <button
        className="bg-black/[.05] font-mono font-semibold px-1 py-0.5 rounded ml-2"
        onClick={handleSubmit}
        disabled={state.loading || !validation.valid || isThrottled}
        aria-label="submit"
        title={
          isThrottled
            ? 'please wait'
            : !validation.valid
            ? validation.error
            : state.error
            ? state.error
            : 'submit idea for critique'
        }
      >
        submit
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Chat />
        </div>
      </main>
      <footer className="bg-black/[.05] text-white/25 text-[9px] font-mono font-semibold row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p>unvalidated responses inferred at individual risk</p>
      </footer>
    </div>
  );
}
