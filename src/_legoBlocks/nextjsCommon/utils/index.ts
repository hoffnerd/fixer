




/**
 * Takes a number of milliseconds as input and returns a promise that resolves after the specified time has elapsed.
 * @param milliseconds - int, represents the number of milliseconds for which the function will pause execution before resolving the promise.
 */
export const sleep = (milliseconds: number) => new Promise((r) => setTimeout(r, (milliseconds)));

/**
 * The `normalizeTwoDigitNumber` function in TypeScript takes a number and returns it as a two-digit string with a leading zero if necessary.
 * @param num - int, represents the number to be normalized.
 */
export const normalizeTwoDigitNumber = (num: number) => num < 10 ? `0${num}` : num;