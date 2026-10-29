# knuth-morris-pratt-search-ts

Substring search using the Knuth-Morris-Pratt algorithm, exposed as plain ESM functions with no dependencies.

```js
import { search, findAll, buildPrefixFunction } from 'knuth-morris-pratt-search-ts';

search('the quick brown fox', 'brown');   // 10
findAll('ababababab', 'aba');             // [0, 4]
buildPrefixFunction('ababaca');           // [0, 0, 1, 2, 3, 0, 1]
```

## Why this exists

`String.prototype.indexOf` is fine for one-off lookups, but it re-scans characters the algorithm already knows about. When the same pattern is searched for repeatedly — scanning a log stream, tokenising many lines — the prefix function is computed once and reused, so each search does at most `text.length + pattern.length` comparisons.

The trade-off is that this is pure JavaScript operating on UTF-16 code units, so it is slower than the native `indexOf` for a single search. Use it when you search the same pattern many times and want to avoid redundant work, or when you need the prefix function itself for related string-matching tasks.

## Edge cases

`search` treats an empty pattern the same way `indexOf` does: it returns `0`. `findAll` with an empty pattern returns `[]` rather than every index, because returning one match per position is rarely what anyone wants. Matches found by `findAll` are non-overlapping: after a hit at position `p`, scanning resumes at `p + pattern.length`.
