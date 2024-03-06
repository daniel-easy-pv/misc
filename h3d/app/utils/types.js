/**
 * Represents a result that can be either a success or an error.
 *
 * @template T - The type of the successful result.
 * @template E - The type of the error.
 *
 * @typedef {Object} Result
 * @property {boolean} ok - Indicates if the operation was successful.
 * @property {T} [value] - The successful result.
 * @property {E} [error] - The error information.
 */