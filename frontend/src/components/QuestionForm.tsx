"use client";

type Question = {
  key: string;
  label: string;
  type: "select" | "multi" | "text";
  options?: string[];
  placeholder?: string;
};

type Props = {
  questions: Question[];
  answers: Record<string, any>;
  setAnswers: (answers: Record<string, any>) => void;
};

export default function QuestionForm({
  questions,
  answers,
  setAnswers,
}: Props) {
  const handleSelect = (key: string, value: string) => {
    setAnswers({ ...answers, [key]: value });
  };

  const handleMulti = (key: string, value: string) => {
    const current: string[] = answers[key] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setAnswers({ ...answers, [key]: updated });
  };

  const handleText = (key: string, value: string) => {
    setAnswers({ ...answers, [key]: value });
  };

  if (!questions?.length) return null;

  return (
    <div>
      {questions.map((q) => (
        <div key={q.key} className="q-block">
          <label>{q.label}</label>

          {/* SELECT */}
          {q.type === "select" && (
            <select
              value={answers[q.key] || ""}
              onChange={(e) => handleSelect(q.key, e.target.value)}
            >
              {q.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}

          {/* MULTI */}
          {q.type === "multi" && (
            <div className="multi-grid">
              {q.options?.map((opt) => {
                const selected = (answers[q.key] || []).includes(opt);
                return (
                  <label
                    key={opt}
                    className={`multi-chip ${selected ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => handleMulti(q.key, opt)}
                    />
                    <span className="chip-check">{selected ? "✓" : ""}</span>
                    {opt}
                  </label>
                );
              })}
            </div>
          )}

          {/* TEXT */}
          {q.type === "text" && (
            <input
              type="text"
              value={answers[q.key] || ""}
              onChange={(e) => handleText(q.key, e.target.value)}
              placeholder={
                (q as any).placeholder || `Enter ${q.label.toLowerCase()}...`
              }
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#e8e6f0",
                fontFamily: "'Syne', sans-serif",
                fontSize: "14px",
                padding: "10px 14px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(99,87,255,0.5)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}
