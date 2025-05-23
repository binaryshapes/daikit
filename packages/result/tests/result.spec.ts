import { type Result, failure, isFail, isSuccess, success } from '../src/result';

describe('Result', () => {
  it('should create a Success result with the given value', () => {
    const value = 10;
    const result = success(value);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value).toBe(value);
    }
    expect(isFail(result)).toBe(false);
  });

  it('should create a Fail result with the given failure', () => {
    const cause = 'Something went wrong';
    const result = failure(cause);

    expect(isFail(result)).toBe(true);
    if (isFail(result)) {
      expect(result.cause).toBe(cause);
    }
    expect(isSuccess(result)).toBe(false);
  });

  it('should correctly identify a Success result using isSuccess', () => {
    const value = 'hello';
    const result = success(value);
    expect(isSuccess(result)).toBe(true);
  });

  it('should correctly identify a Fail result using isFail', () => {
    const cause = 500;
    const result = failure(cause);
    expect(isFail(result)).toBe(true);
  });

  it('should ensure isSuccess returns false for a Fail result', () => {
    const result = failure('error');
    expect(isSuccess(result)).toBe(false);
  });

  it('should ensure isFail returns false for a Success result', () => {
    const result = success(true);
    expect(isFail(result)).toBe(false);
  });

  it('should work with different success and failure types', () => {
    const successResult: Result<number, string> = success(42);
    expect(isSuccess(successResult)).toBe(true);
    if (isSuccess(successResult)) {
      expect(successResult.value).toBe(42);
    }

    const failureResult: Result<number, string> = failure('Not found');
    expect(isFail(failureResult)).toBe(true);
    if (isFail(failureResult)) {
      expect(failureResult.cause).toBe('Not found');
    }

    const successStringResult: Result<string, Error> = success('data');
    expect(isSuccess(successStringResult)).toBe(true);
    if (isSuccess(successStringResult)) {
      expect(successStringResult.value).toBe('data');
    }

    const failureErrorResult: Result<string, Error> = failure(new Error('Test error'));
    expect(isFail(failureErrorResult)).toBe(true);
    if (isFail(failureErrorResult)) {
      expect(failureErrorResult.cause.message).toBe('Test error');
    }
  });

  it('should narrow the type to Success within the isSuccess block', () => {
    const result: Result<number, string> =
      Math.random() > 0.5 ? success(100) : failure('random error');
    if (isSuccess(result)) {
      expect(result.value).toBeGreaterThanOrEqual(0);
    }
  });

  it('should narrow the type to Fail within the isFail block', () => {
    const result: Result<number, string> =
      Math.random() > 0.5 ? success(200) : failure('another random error');
    if (isFail(result)) {
      expect(typeof result.cause).toBe('string');
    }
  });
});
