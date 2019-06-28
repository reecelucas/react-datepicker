/**
 * Returns a multidimensional array where each child array
 * has a length of `size`. Taken from: https://30secondsofcode.org/#chunk
 */
export const chunkArray = <T>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
