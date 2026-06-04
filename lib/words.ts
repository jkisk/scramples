let wordSet: Set<string> | null = null;
let loadPromise: Promise<void> | null = null;

export async function loadWordList(): Promise<void> {
  if (wordSet !== null) return;
  if (loadPromise) return loadPromise;
  loadPromise = fetch("/words.txt")
    .then((res) => res.text())
    .then((text) => {
      wordSet = new Set(
        text
          .split("\n")
          .map((w) => w.trim().toLowerCase())
          .filter((w) => w.length >= 3)
      );
    });
  return loadPromise;
}

export function isValidDictionaryWord(word: string): boolean {
  return wordSet !== null && wordSet.has(word.toLowerCase());
}

export function canFormFromLetters(word: string, letters: string[]): boolean {
  const pool = letters.map((l) => l.toLowerCase());
  for (const ch of word.toLowerCase()) {
    const idx = pool.indexOf(ch);
    if (idx === -1) return false;
    pool.splice(idx, 1);
  }
  return true;
}
