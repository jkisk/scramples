const KEY = "scramples:personalBest";

export function getPersonalBest(): number {
  if (typeof window === "undefined") return 0;
  try {
    const val = localStorage.getItem(KEY);
    const parsed = val ? parseInt(val, 10) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    return 0;
  }
}

export function savePersonalBest(score: number): boolean {
  if (typeof window === "undefined") return false;
  const current = getPersonalBest();
  if (score > current) {
    try {
      localStorage.setItem(KEY, String(score));
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
