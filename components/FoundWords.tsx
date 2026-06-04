"use client";

export interface FoundWord {
  word: string;
  pts: number;
}

interface FoundWordsProps {
  words: FoundWord[];
}

export function FoundWords({ words }: FoundWordsProps) {
  return (
    <div className="card">
      <div className="found-head">
        <h3>Found words</h3>
        <h3 style={{ color: "var(--accent)" }}>{words.length}</h3>
      </div>
      <div className="found-list">
        {words.length === 0 ? (
          <span className="found-empty">nothing yet — go find some!</span>
        ) : (
          words.map((f, i) => (
            <span key={i} className={`chip${f.word.length >= 7 ? " big7" : ""}`}>
              {f.word.toUpperCase()} <span className="cpts">+{f.pts}</span>
            </span>
          ))
        )}
      </div>
    </div>
  );
}
