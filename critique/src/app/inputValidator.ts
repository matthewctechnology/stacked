const forbiddenPatterns = [
  /{{.*}}/i,
  /<script.*?>.*?<\/script>/i,
  /\b(system|user|assistant)\b/i,
  /\btemperature\s*[:=]\s*(1(\.0+)?|0\.\d{2,})\b/i,
  /\b(select|insert|delete|drop|update)\b/i,
  /\b(alert|confirm|prompt)\b/i,
];

export const validateInput = (input: string): { valid: boolean; error?: string } => {
  if (!input.trim()) {
    return { valid: false, error: 'input empty' };
  }
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(input)) {
      return { valid: false, error: 'input forbidden' };
    }
  }
  if (input.length > 256) {
    return { valid: false, error: 'input too long' };
  }
  return { valid: true };
};
