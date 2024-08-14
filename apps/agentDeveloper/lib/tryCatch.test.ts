import { tryCatch } from './tryCatch';

describe('tryCatch', () => {
  it('returns the resolved value when the function resolves', async () => {
    const fn = jest.fn().mockResolvedValue('Success');
    const wrappedFn = tryCatch(fn);
    const result = await wrappedFn('input');
    expect(result).toBe('Success');
  });

  it('returns an error message when the function rejects', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('Failure'));
    const wrappedFn = tryCatch(fn);
    const result = await wrappedFn('input');
    expect(result).toBe('Error: Error: Failure');
  });

  it('handles empty string as resolved value', async () => {
    const fn = jest.fn().mockResolvedValue('');
    const wrappedFn = tryCatch(fn);
    const result = await wrappedFn('input');
    expect(result).toBe('');
  });

  it('handles empty string as rejected value', async () => {
    const fn = jest.fn().mockRejectedValue(new Error(''));
    const wrappedFn = tryCatch(fn);
    const result = await wrappedFn('input');
    expect(result).toBe('Error: Error');
  });

  it('handles non-string error values', async () => {
    const fn = jest.fn().mockRejectedValue({ message: 'Object error' });
    const wrappedFn = tryCatch(fn);
    const result = await wrappedFn('input');
    expect(result).toBe('Error: [object Object]');
  });

  it('handles non-error objects as rejection', async () => {
    const fn = jest.fn().mockRejectedValue({ some: 'value' });
    const wrappedFn = tryCatch(fn);
    const result = await wrappedFn('input');
    expect(result).toBe('Error: [object Object]');
  });

  it('handles undefined error message', async () => {
    const fn = jest.fn().mockRejectedValue({});
    const wrappedFn = tryCatch(fn);
    const result = await wrappedFn('input');
    expect(result).toBe('Error: [object Object]');
  });
});
