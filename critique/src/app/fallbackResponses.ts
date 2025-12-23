export interface FallbackResponseProvider {
  getResponse: () => string;
}

const responses = [
  "a critique",
  "another critique"
]

export const fallbackResponseProvider: FallbackResponseProvider = {
  getResponse: () => {
    const simulateAIResponse = () => {
      const random = Math.floor(Math.random() * responses.length);
      return responses[random];
    }
    simulateAIResponse();

    return responses[responses.length - 1];
  }
};
