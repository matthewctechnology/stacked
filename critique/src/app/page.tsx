'use client'

import { useState } from 'react';


export function Chat() {
  const [input, setInput] = useState('');
  const [showThought, setShowThought] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const inputClick = () => {
    if (showThought) {
      setShowThought(!showThought);
      setShowChat(!showChat)
    }
  };
  const submitClick = () => {
    if (!showChat) {
      setShowThought(!showThought);
      setShowChat(!showChat);
    }
  };

  return (
    <div>
      {
        input?.length === 0
        && <p className="bg-black/[.05] font-mono font-semibold px-1 py-0.5 rounded"> </p>
      }
      {!showChat
        && input?.length > 0
        && <p className="bg-black/[.05] font-mono font-semibold px-1 py-0.5 rounded">
          thinking...
        </p>
      }
      {showChat
        && input?.length > 0
        && <p className="bg-black/[.05] font-mono font-semibold px-1 py-0.5 rounded">
          {input}
        </p>
      }
      <input className="bg-black/[.05] font-mono font-semibold px-1 py-0.5 rounded"
        onFocus={inputClick}
        type='text'
        placeholder="enter an idea"
        value={input}
        onChange={(element) => setInput(element.target.value)}
      />
      <button className="bg-black/[.05] font-mono font-semibold px-1 py-0.5 rounded"
        onClick={submitClick}>submit</button>
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
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
