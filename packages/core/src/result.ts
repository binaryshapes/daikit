/*
 * This file is part of the Mixor project.
 *
 * Copyright (c) 2025, Binary Shapes.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Any } from './generics';

/**
 * Represents a successful result with a value of type T.
 * This is the happy path of the Result monad.
 *
 * @typeParam T - The type of the successful value.
 *
 * @public
 */
type Ok<T> = {
  readonly _id: 'Result';
  readonly _tag: 'Ok';
  readonly value: T;
};

/**
 * Represents a failed result with an error of type E.
 * This is the error path of the Result monad.
 *
 * @typeParam E - The type of the error.
 *
 * @public
 */
type Err<E> = {
  readonly _id: 'Result';
  readonly _tag: 'Err';
  readonly error: E;
};

/**
 * Represents a result that can be either successful (Ok) or failed (Err).
 * This is a discriminated union type that allows for type-safe error handling.
 *
 * @typeParam T - The type of the successful value.
 * @typeParam E - The type of the error.
 *
 * @public
 */
type Result<T, E> = Ok<T> | Err<E>;

// *********************************************************************************************
// Result constructors.
// *********************************************************************************************

/**
 * Creates a successful result with the given value.
 *
 * @typeParam T - The type of the value to wrap.
 * @param value - The value to wrap in a successful result.
 * @returns A new Ok instance containing the value, typed as `Result<T, never>`.
 *
 * @public
 */
function ok<T>(value: T): Result<T, never> {
  return {
    _id: 'Result',
    _tag: 'Ok',
    value,
  };
}

/**
 * Creates a failed result with the given error.
 *
 * @typeParam E - The type of the error, must be a string literal or object.
 * @param error - The error to wrap in a failed result.
 * @returns A new Err instance containing the error, typed as `Result<never, E>`.
 *
 * @public
 */
function err<E extends string | Record<string, Any>>(error: E): Result<never, E> {
  return {
    _id: 'Result',
    _tag: 'Err',
    error,
  };
}

// *********************************************************************************************
// Result type guards.
// *********************************************************************************************

/**
 * Type guard to check if a result is successful.
 *
 * @typeParam T - The type of the successful value.
 * @typeParam E - The type of the error.
 * @param result - The result to check.
 * @returns True if the result is successful (Ok), false otherwise.
 *
 * @public
 */
function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result._tag === 'Ok';
}

/**
 * Type guard to check if a result is failed.
 *
 * @typeParam T - The type of the successful value.
 * @typeParam E - The type of the error.
 * @param result - The result to check.
 * @returns True if the result is failed (Err), false otherwise.
 *
 * @public
 */
function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result._tag === 'Err';
}

/**
 * Type guard to check if a value is a result.
 * Verifies that the value is an object with the correct structure:
 * - Has a '_tag' property
 * - If '_tag' is 'Ok', has a 'value' property
 * - If '_tag' is 'Err', has an 'error' property
 *
 * @param result - The value to check.
 * @returns True if the value is a result with the correct structure, false otherwise.
 *
 * @public
 */
function isResult(result: unknown): result is Result<unknown, unknown> {
  if (typeof result !== 'object' || result === null || result === undefined) {
    return false;
  }

  const isResult = '_id' in result && result._id === 'Result';
  const isOk = isResult && '_tag' in result && result._tag === 'Ok' && 'value' in result;
  const isErr = isResult && '_tag' in result && result._tag === 'Err' && 'error' in result;
  return isOk || isErr;
}

// *********************************************************************************************
// Result helpers.
// *********************************************************************************************

/**
 * Unwraps a result.
 * If the result is ok, returns the value.
 * If the result is err, returns the error.
 *
 * @remarks
 * Commonly used for testing purposes.
 *
 * @param result - The result to unwrap.
 * @returns The value of the result if it is ok, otherwise the error.
 *
 * @public
 */
const unwrap = <T>(result: Result<T, unknown>) => (isOk(result) ? result.value : result.error);

export type { Err, Ok, Result };
export { err, isErr, isOk, isResult, ok, unwrap };
