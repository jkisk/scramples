export const RACK = ["S", "C", "R", "A", "M", "P", "L", "E", "S"];
export const GAME_DURATION_SECONDS = 90;

export interface Tile {
  id: number;
  char: string;
}

let _id = 0;

export function makeTiles(): Tile[] {
  return RACK.map((char) => ({ id: ++_id, char }));
}

export function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
