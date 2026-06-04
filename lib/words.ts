let wordSet: Set<string> | null = null;
let loadPromise: Promise<void> | null = null;

export async function loadWordList(): Promise<void> {
  if (wordSet !== null) return;
  if (loadPromise) return loadPromise;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  loadPromise = fetch(`${base}/words.txt`)
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
