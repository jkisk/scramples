import assert from "node:assert/strict";
import test from "node:test";

import { generateLetters, makeTiles, scoreWord, shuffled } from "../lib/game.ts";

test("scoreWord uses the documented score table", () => {
  assert.equal(scoreWord(2), 0);
  assert.equal(scoreWord(3), 1);
  assert.equal(scoreWord(4), 2);
  assert.equal(scoreWord(5), 4);
  assert.equal(scoreWord(6), 6);
  assert.equal(scoreWord(7), 10);
  assert.equal(scoreWord(12), 10);
});

test("makeTiles assigns stable unique ids and preserves letters", () => {
  const tiles = makeTiles(["S", "C", "R"]);

  assert.deepEqual(
    tiles.map((tile) => tile.char),
    ["S", "C", "R"]
  );
  assert.equal(new Set(tiles.map((tile) => tile.id)).size, tiles.length);
});

test("shuffled returns a new array with the same values", () => {
  const original = ["A", "B", "C", "D"];
  const result = shuffled(original);

  assert.notEqual(result, original);
  assert.deepEqual([...result].sort(), original);
  assert.deepEqual(original, ["A", "B", "C", "D"]);
});

test("generateLetters returns nine playable letters with enough vowels", () => {
  const vowels = new Set(["A", "E", "I", "O", "U"]);

  for (let i = 0; i < 100; i += 1) {
    const letters = generateLetters(9);
    const vowelCount = letters.filter((letter) => vowels.has(letter)).length;

    assert.equal(letters.length, 9);
    assert.ok(vowelCount >= 3, `expected at least 3 vowels, got ${vowelCount}`);
    assert.ok(vowelCount <= 5, `expected at most 5 vowels, got ${vowelCount}`);
  }
});
