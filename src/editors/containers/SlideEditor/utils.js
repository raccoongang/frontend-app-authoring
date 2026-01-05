/**
 * Restricts a given value within a specified range defined by minimum and maximum boundaries.
 *
 * If the value is less than the minimum boundary, the function returns the minimum.
 * If the value is greater than the maximum boundary, the function returns the maximum.
 * Otherwise, the function returns the value itself.
 *
 * @param {number} value - The number to be clamped within the range.
 * @param {number} min - The lower boundary of the range.
 * @param {number} max - The upper boundary of the range.
 * @returns {number} The clamped value within the inclusive range of `min` to `max`.
 */
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/**
 * Generates an array of color options from a given color map.
 * Each color option is an object structured with `value` and `label` properties.
 *
 * @param {Array<string>} colorMap - An array of strings where even-indexed elements represent the color values
 *                                   and the subsequent odd-indexed elements represent the corresponding labels.
 * @returns {Array<{ value: string, label: string }>}
 * An array of color option objects, each containing a `value` and `label`.
 */
export const getColorOptions = (colorMap) => Array.from(
  { length: colorMap.length / 2 },
  (_, i) => ({
    value: colorMap[i * 2],
    label: colorMap[i * 2 + 1],
  }),
);
