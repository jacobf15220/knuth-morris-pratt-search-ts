import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPrefixFunction, search, findAll } from '../src/index.js';

test('buildPrefixFunction: empty pattern yields empty array', () => {
  assert.deepEqual(buildPrefixFunction(''), []);
});

test('buildPrefixFunction: single character yields [0]', () => {
  assert.deepEqual(buildPrefixFunction('a'), [0]);
});

test('buildPrefixFunction: no repeating prefix', () => {
  assert.deepEqual(buildPrefixFunction('abcdef'), [0, 0, 0, 0, 0, 0]);
});

test('buildPrefixFunction: pattern with internal repeat', () => {
  // "ababaca" — the classic textbook example.
  assert.deepEqual(buildPrefixFunction('ababaca'), [0, 0, 1, 2, 3, 0, 1]);
});

test('buildPrefixFunction: all same character', () => {
  assert.deepEqual(buildPrefixFunction('aaaa'), [0, 1, 2, 3]);
});

test('search: empty pattern returns 0', () => {
  assert.equal(search('anything', ''), 0);
});

test('search: empty text with non-empty pattern returns -1', () => {
  assert.equal(search('', 'a'), -1);
});

test('search: pattern not present', () => {
  assert.equal(search('hello world', 'xyz'), -1);
});

test('search: pattern at start', () => {
  assert.equal(search('hello world', 'hello'), 0);
});

test('search: pattern at end', () => {
  assert.equal(search('hello world', 'world'), 6);
});

test('search: pattern in middle', () => {
  assert.equal(search('ababababca', 'ababc'), 4);
});

test('search: single character match', () => {
  assert.equal(search('abcdef', 'd'), 3);
});

test('search: single char not found', () => {
  assert.equal(search('abcdef', 'z'), -1);
});

test('findAll: no matches', () => {
  assert.deepEqual(findAll('abcdef', 'xy'), []);
});

test('findAll: non-overlapping matches', () => {
  assert.deepEqual(findAll('aaaa', 'aa'), [0, 2]);
});

test('findAll: matches with partial overlap not double-counted', () => {
  assert.deepEqual(findAll('abababab', 'abab'), [0, 4]);
});

test('findAll: empty pattern returns empty array', () => {
  assert.deepEqual(findAll('abc', ''), []);
});

test('search throws TypeError for non-string text', () => {
  assert.throws(() => search(42, 'a'), TypeError);
});

test('search throws TypeError for non-string pattern', () => {
  assert.throws(() => search('abc', null), TypeError);
});
