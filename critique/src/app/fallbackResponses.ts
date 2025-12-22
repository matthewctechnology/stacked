export interface FallbackResponseProvider {
  getResponse: (_input: string) => string;
}

const responses = [
  {
    match: (input: string) => input?.trim()?.length < 8,
    response: "Certainly! Please share a bit more about your idea, and I'll provide a concise critique referencing core design principles. This will help ensure your concept is both effective and grounded."
  },
  {
    match: (input: string) => input?.trim()?.length,
    response: "Thank you for sharing your idea. Here's a generic critique referencing core design principles: Consider clarity, usability, consistency, and visual hierarchy to ensure your concept is effective and accessible."
  }
];

export const fallbackResponseProvider: FallbackResponseProvider = {
  getResponse: (input: string) => {
    for (const { match, response } of responses) {
      if (match(input)) return response;
    }

    return responses[responses.length - 1].response;
  }
};
