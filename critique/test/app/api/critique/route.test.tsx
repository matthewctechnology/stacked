/**
 * @jest-environment node
 */
import { afterAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { POST } from '../../../../src/app/api/critique/route';
import type { NextRequest } from 'next/server';


const mockEnv = process.env;

describe('/api/critique API route', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...mockEnv, GITHUB_TOKEN: 'test-token' };
  });

  afterAll(() => {
    process.env = mockEnv;
  });

  test('rejects invalid input', async () => {
    global.fetch = jest.fn().mockRejectedValue({
      ok: false,
      message: 'invalid input'
    } as never ) as typeof fetch;
    const req = { json: async () => ({ input: 42 }) } as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('invalid input');
  });

  test('rejects missing token', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      message: 'server misconfigured'
    } as never) as typeof fetch;
    process.env.GITHUB_TOKEN = '';
    const req = { json: async () => ({ input: 'valid idea' }) } as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('server misconfigured');
  });

  test('returns AI message on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'AI critique response' } }]
      })
    } as never) as typeof fetch;
    const req = { json: async () => ({ input: 'valid idea' }) } as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toBe('AI critique response');
  });

  test('returns empty AI message on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: '' } }]
      })
    } as never) as typeof fetch;
    const req = { json: async () => ({ input: 'valid idea' }) } as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toBe('empty response');
  });

  test('returns error if AI API fails', async () => {
    global.fetch = jest.fn().mockRejectedValue({
      ok: false,
      message: 'AI API error'
    } as never ) as typeof fetch;
    const req = { json: async () => ({ input: 'valid idea' }) } as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data.error.message).toBe('AI API error');
  });
});
