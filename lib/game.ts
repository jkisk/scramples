export const GAME_DURATION_SECONDS = 90;

export interface Tile {
  id: number;
  char: string;
}

let _id = 0;

export function makeTiles(letters: string[]): Tile[] {
  return letters.map((char) => ({ id: ++_id, char }));
}

export function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function scoreWord(len: number): number {
  if (len <= 2) return 0;
  if (len === 3) return 1;
  if (len === 4) return 2;
  if (len === 5) return 4;
  if (len === 6) return 6;
  return 10;
}

const LETTER_WEIGHTS: [string, number][] = [
  ["A", 9], ["B", 2], ["C", 2], ["D", 4], ["E", 12], ["F", 2],
  ["G", 3], ["H", 2], ["I", 9], ["J", 1], ["K", 1], ["L", 4],
  ["M", 2], ["N", 6], ["O", 8], ["P", 2], ["Q", 1], ["R", 6],
  ["S", 4], ["T", 6], ["U", 4], ["V", 2], ["W", 2], ["X", 1],
  ["Y", 2], ["Z", 1],
];

const LETTER_POOL: string[] = LETTER_WEIGHTS.flatMap(([letter, count]) =>
  Array(count).fill(letter)
);

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

export function generateLetters(count = 9): string[] {
  for (let attempt = 0; attempt < 20; attempt++) {
    const pool = [...LETTER_POOL].sort(() => Math.random() - 0.5);
    const picked = pool.slice(0, count);
    const vowelCount = picked.filter((l) => VOWELS.has(l)).length;
    if (vowelCount >= 3 && vowelCount <= 5) return picked;
  }
  const vowelPool = LETTER_POOL.filter((l) => VOWELS.has(l)).sort(() => Math.random() - 0.5);
  const consonantPool = LETTER_POOL.filter((l) => !VOWELS.has(l)).sort(() => Math.random() - 0.5);
  return [...vowelPool.slice(0, 3), ...consonantPool.slice(0, count - 3)];
}
