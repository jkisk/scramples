import { assetPath } from "./paths";

let wordSet: Set<string> | null = null;
let loadPromise: Promise<void> | null = null;

export async function loadWordList(): Promise<void> {
  if (wordSet !== null) return;
  if (loadPromise) return loadPromise;
  loadPromise = fetch(assetPath("/words.txt"))
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to load word list: ${res.status}`);
      }
      return res.text();
    })
    .then((text) => {
      wordSet = new Set(
        text
          .split("\n")
          .map((w) => w.trim().toLowerCase())
          .filter((w) => w.length >= 3)
      );
    })
    .catch((error) => {
      loadPromise = null;
      throw error;
    });
  return loadPromise;
}

export function isValidDictionaryWord(word: string): boolean {
  return wordSet !== null && wordSet.has(word.toLowerCase());
}
