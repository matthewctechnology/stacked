const forbiddenPatterns = [
  /{{.*}}/i,
  /<script.*?>.*?<\/script>/i,
  /\b(system|user|assistant)\b/i,
  /\b(select|insert|delete|drop|update)\b/i,
  /\b(alert|confirm|prompt)\b/i,
];

const temperaturePattern = /\btemperature\s*[:=]\s*(-?\d+(\.\d+)?)/i;

export const validateInput = (input: string): { valid: boolean; error?: string } => {
  if (!input.trim()) {
    return { valid: false, error: 'input empty' };
  }
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(input)) {
      return { valid: false, error: 'input forbidden' };
    }
  }

  const tempMatch = input.match(temperaturePattern);

  if (tempMatch) {
    const tempValue = parseFloat(tempMatch[1]);
    if (isNaN(tempValue) || tempValue < 0 || tempValue > 0.2) {
      return { valid: false, error: 'input temprature forbidden' };
    }
  }

  if (input.length > 256) {
    return { valid: false, error: 'input too long' };
  }
  return { valid: true };
};
