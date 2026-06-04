export const WORD_LIST = [
  // 3 letters
  "ace","ale","alp","amp","ape","arc","are","arm","asp","cam","cap","car",
  "ear","elm","era","lam","lap","mac","map","mar","pal","par","pea","per",
  "ram","rap","rep","sac","sap","sea","spa",
  // 4 letters
  "aces","acme","acre","ales","alms","amps","apes","arcs","arms","camp",
  "cams","cape","caps","care","carp","cars","case","clam","clap","cram",
  "crap","earl","ears","elms","lace","lamp","laps","leap","mace","male",
  "maps","mare","mars","meal","mesa","pace","pale","palm","pals","pare",
  "peal","pear","peas","perm","plea","race","ramp","rams","rape","raps",
  "real","ream","reap","scam","scar","seal","seam","sear","slam","slap",
  "spam","spar","spec","rasp","mass","pass","lass","spas",
  // 5 letters
  "acres","ample","camel","camps","caper","capes","cares","carps","cases",
  "clamp","clams","claps","clasp","cramp","crams","craps","laces","lamps",
  "lapse","laser","leaps","maces","maple","mares","pacer","paces","paler",
  "pales","palms","pares","parse","pearl","pears","perms","place","pleas",
  "races","ramps","rapes","reams","reaps","recap","scalp","scamp","scams",
  "scare","scarp","scram","scrap","seals","seams","smear","space","spare",
  "spasm","spear",
  // 6 letters
  "ampler","camels","capers","carpel","clamps","clasps","cramps","creams",
  "escarp","maples","parcel","parsec","placer","places","recaps","sample",
  "scaler","scamps","scrape","scraps","spacer","spares","spears","smears",
  // 7 letters
  "campers","carpels","parcels","sampler","samples","scalper","scamper",
  "scrapes","spacers",
];

const VALID = new Set(WORD_LIST);

export function isValidWord(word: string): boolean {
  return VALID.has(word.toLowerCase());
}

export function scoreWord(len: number): number {
  if (len >= 7) return 10;
  if (len === 6) return 6;
  if (len === 5) return 4;
  if (len === 4) return 2;
  if (len === 3) return 1;
  return 0;
}

export const TOTAL_WORDS = WORD_LIST.length;
export const TOTAL_POSSIBLE = WORD_LIST.reduce((s, w) => s + scoreWord(w.length), 0);
