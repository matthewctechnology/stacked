import { describe, expect, jest, test } from '@jest/globals';
import Home from '../../../../src/app/page';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


describe('API /api/critique', () => {
  test('rejects invalid input', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ error: 'invalid input' }),
      ok: false
    } as never) as typeof fetch;
    render(<Home />);
    const inputField = screen.getByPlaceholderText('enter an idea');
    const button = screen.getByRole('button', { name: 'submit' }) as HTMLButtonElement;

    await userEvent.type(inputField, 'a'.repeat(257));
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('title')).toBe('input too long');
  });

  test('falls back on missing token', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ error: 'server misconfigured' }),
      ok: false
    } as never) as typeof fetch;
    render(<Home />);
    process.env.GITHUB_TOKEN = '';
    const inputField = screen.getByPlaceholderText('enter an idea');
    const button = screen.getByRole('button', { name: 'submit' });

    await userEvent.type(inputField, 'valid idea');
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByTestId('ai').textContent).not.toBeNull();
    });
  });

  test('should display AI response from API', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ message: 'good example of simplicity' }),
      ok: true
    } as never) as typeof fetch;
    render(<Home />);
    const inputField = screen.getByPlaceholderText('enter an idea');
    const button = screen.getByRole('button', { name: 'submit' });

    await userEvent.type(inputField, 'an image with black background');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('ai').textContent).toBe('good example of simplicity');
    });
  });
});
