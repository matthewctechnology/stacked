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
    const req = { json: async () => ({ input: ' ' }) } as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe('Not Found');
  });

  test('rejects missing token', async () => {
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
