'use client';

import { useEffect } from 'react';
import { useChatReducer } from './useChatReducer';
import { validateInput } from './inputValidator';


export function Chat() {
  const { state, dispatch, simulateAIResponse } = useChatReducer();
  const validation = validateInput(state.input);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'INPUT_CHANGE', value: e.target.value });
  };

  const handleSubmit = () => {
    if (!validation.valid) {
      dispatch({ type: 'ERROR', value: validation.error || 'Invalid input.' });
      return;
    }
    dispatch({ type: 'SUBMIT' });

    setTimeout(() => {
      const aiReply = simulateAIResponse();
      dispatch({ type: 'RESPONSE', value: aiReply });
    }, 800);
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
        disabled={state.loading || !validation.valid}
        aria-label="submit"
        title={!validation.valid ? validation.error : 'submit idea for critique'}
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
