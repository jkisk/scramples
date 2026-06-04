const KEY = "scramples:personalBest";

export function getPersonalBest(): number {
  if (typeof window === "undefined") return 0;
  const val = localStorage.getItem(KEY);
  return val ? parseInt(val, 10) : 0;
}

export function savePersonalBest(score: number): boolean {
  if (typeof window === "undefined") return false;
  const current = getPersonalBest();
  if (score > current) {
    localStorage.setItem(KEY, String(score));
    return true;
  }
  return false;
}
