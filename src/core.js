/**
 * Computes the prefix function (pi array) for a pattern.
 *
 * pi[i] is the length of the longest proper prefix of pattern[0..i]
 * that is also a suffix of pattern[0..i]. "Proper" means strictly
 * shorter than the substring itself, so pi[i] <= i.
 *
 * This is the standard table the algorithm uses to decide how far
 * back to slide the pattern when a mismatch occurs, so we never
 * re-examine a character we already matched.
 *
 * @param {string} pattern
 * @returns {number[]}
 */
export function buildPrefixFunction(pattern) {
  if (typeof pattern !== 'string') {
    throw new TypeError('pattern must be a string');
  }

  const n = pattern.length;
  const pi = new Array(n).fill(0);

  // k is the current candidate match length from the previous step.
  // We start q at 1 because pi[0] is always 0 (a single character has
  // no proper prefix that is also a suffix).
  let k = 0;
  for (let q = 1; q < n; q++) {
    while (k > 0 && pattern.charCodeAt(k) !== pattern.charCodeAt(q)) {
      k = pi[k - 1];
    }
    if (pattern.charCodeAt(k) === pattern.charCodeAt(q)) {
      k++;
    }
    pi[q] = k;
  }

  return pi;
}

/**
 * Finds the first occurrence of `pattern` in `text` using the
 * Knuth-Morris-Pratt algorithm.
 *
 * Returns the starting index of the first match, or -1 if none.
 * An empty pattern matches at index 0 by convention, mirroring
 * String.prototype.indexOf.
 *
 * @param {string} text
 * @param {string} pattern
 * @returns {number}
 */
export function search(text, pattern) {
  if (typeof text !== 'string') {
    throw new TypeError('text must be a string');
  }
  if (typeof pattern !== 'string') {
    throw new TypeError('pattern must be a string');
  }

  if (pattern.length === 0) {
    return 0;
  }

  const pi = buildPrefixFunction(pattern);
  let q = 0;

  for (let i = 0; i < text.length; i++) {
    while (q > 0 && pattern.charCodeAt(q) !== text.charCodeAt(i)) {
      q = pi[q - 1];
    }
    if (pattern.charCodeAt(q) === text.charCodeAt(i)) {
      q++;
    }
    if (q === pattern.length) {
      return i - pattern.length + 1;
    }
  }

  return -1;
}

/**
 * Finds every occurrence of `pattern` in `text`.
 *
 * Returns an array of starting indices, in ascending order.
 * Non-overlapping semantics: after a match is found at index p,
 * scanning resumes at index p + pattern.length. This is the
 * behaviour most callers expect and keeps the result predictable.
 *
 * @param {string} text
 * @param {string} pattern
 * @returns {number[]}
 */
export function findAll(text, pattern) {
  if (typeof text !== 'string') {
    throw new TypeError('text must be a string');
  }
  if (typeof pattern !== 'string') {
    throw new TypeError('pattern must be a string');
  }

  if (pattern.length === 0) {
    return [];
  }

  const pi = buildPrefixFunction(pattern);
  const result = [];
  let q = 0;

  for (let i = 0; i < text.length; i++) {
    while (q > 0 && pattern.charCodeAt(q) !== text.charCodeAt(i)) {
      q = pi[q - 1];
    }
    if (pattern.charCodeAt(q) === text.charCodeAt(i)) {
      q++;
    }
    if (q === pattern.length) {
      const start = i - pattern.length + 1;
      result.push(start);
      // Non-overlapping: reset q to 0 so the next search starts
      // fresh at the character after the match.
      q = 0;
    }
  }

  return result;
}
