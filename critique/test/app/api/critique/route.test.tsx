/**
 * @jest-environment node
 */
import { afterAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { NextRequest } from 'next/server';

let openaiChatCompletionsCreate: jest.Mock;

jest.mock('openai', () => {
  return {
    __esModule: true,
    default: function () {
      return {
        chat: {
          completions: {
            create: (...args: []) => openaiChatCompletionsCreate(...args)
          }
        }
      };
    }
  };
});

const mockEnv = process.env;

describe('/api/critique API route', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...mockEnv, GITHUB_TOKEN: 'test-token' };
    openaiChatCompletionsCreate = jest.fn();
  });

  afterAll(() => {
    process.env = mockEnv;
  });

  test('rejects invalid input', async () => {
    const { POST } = await import('../../../../src/app/api/critique/route');
    const req = { json: async () => ({ input: 42 }) } as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('invalid input');
  });

  test('rejects missing token', async () => {
    process.env.GITHUB_TOKEN = '';
    const { POST } = await import('../../../../src/app/api/critique/route');
    const req = { json: async () => ({ input: 'valid idea' }) } as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('server misconfigured');
  });

  test('returns AI message on success', async () => {
    openaiChatCompletionsCreate.mockResolvedValue({
      choices: [{ message: { content: 'AI critique response' } }]
    } as never);
    const { POST } = await import('../../../../src/app/api/critique/route');
    const req = { json: async () => ({ input: 'valid idea' }) } as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toBe('AI critique response');
  });

  test('returns empty AI message on success', async () => {
    openaiChatCompletionsCreate.mockResolvedValue({
      choices: [{ message: { content: '' } }]
    } as never);
    const { POST } = await import('../../../../src/app/api/critique/route');
    const req = { json: async () => ({ input: 'valid idea' }) } as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toBe('empty response');
  });

  test('returns error if AI API fails', async () => {
    openaiChatCompletionsCreate.mockRejectedValue(new Error('AI API error') as never);
    const { POST } = await import('../../../../src/app/api/critique/route');
    const req = { json: async () => ({ input: 'valid idea' }) } as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data.error).toBe('AI API error');
  });
});
