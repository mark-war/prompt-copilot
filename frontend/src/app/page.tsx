"use client";

import { useEffect, useState } from "react";
import QuestionForm from "@/components/QuestionForm";

const CATEGORIES = [
  {
    id: "game",
    label: "Game",
    icon: "⟁",
    desc: "Build playable browser games",
  },
  {
    id: "coding",
    label: "Code",
    icon: "⌥",
    desc: "Generate production-ready code",
  },
  {
    id: "writing",
    label: "Write",
    icon: "◈",
    desc: "Craft compelling content",
  },
  {
    id: "image",
    label: "Image",
    icon: "◉",
    desc: "Generate stunning AI images",
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: "⊕",
    desc: "Convert browsers to buyers",
  },
  {
    id: "career",
    label: "Career",
    icon: "◎",
    desc: "Land your next opportunity",
  },
];

export default function Home() {
  const getDefaultAnswers = (cat: string) => {
    switch (cat) {
      case "game":
        return { genre: "sudoku" };
      case "coding":
        return { type: "rest api" };
      case "writing":
        return { type: "blog post" };
      case "image":
        return { type: "portrait" };
      case "marketing":
        return { type: "landing page copy" };
      case "career":
        return { type: "resume bullets" };
      default:
        return {};
    }
  };

  const [category, setCategory] = useState("game");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState<Record<string, any>>(
    getDefaultAnswers("game"),
  );
  const [preview, setPreview] = useState("");
  const [isRefined, setIsRefined] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [copied, setCopied] = useState(false);

  const getSubType = () =>
    (answers as any).genre ?? (answers as any).type ?? "";

  useEffect(() => {
    const load = async () => {
      const res = await fetch(
        `http://localhost:5000/api/prompts/questions/${category}/${getSubType()}`,
      );
      const data = await res.json();
      setQuestions(data);
    };
    load();
  }, [category, (answers as any).genre, (answers as any).type]);

  useEffect(() => {
    setIsRefined(false);
    setPreview("");
  }, [(answers as any).genre]);

  useEffect(() => {
    if (isRefined) return;
    const timeout = setTimeout(async () => {
      if (!category) return;
      const res = await fetch("http://localhost:5000/api/prompts/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, answers }),
      });
      const data = await res.json();
      if (data?.prompt) setPreview(data.prompt);
    }, 400);
    return () => clearTimeout(timeout);
  }, [answers, category, isRefined]);

  const refine = async () => {
    setIsRefining(true);
    const res = await fetch("http://localhost:5000/api/prompts/refine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: preview, category }),
    });
    const data = await res.json();
    setPreview(data.prompt);
    setIsRefined(true);
    setIsRefining(false);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setAnswers(getDefaultAnswers(newCategory));
    setPreview("");
    setIsRefined(false);
  };

  const handleSetAnswers = (newAnswers: Record<string, any>) => {
    const oldSubType = (answers as any).genre ?? (answers as any).type;
    const newSubType = newAnswers.genre ?? newAnswers.type;
    if (newSubType && newSubType !== oldSubType) {
      const key = category === "game" ? "genre" : "type";
      setAnswers({ [key]: newSubType });
    } else {
      setAnswers(newAnswers);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #080910;
          color: #e8e6f0;
          font-family: 'Syne', sans-serif;
          min-height: 100vh;
        }

        .app {
          min-height: 100vh;
          background: #080910;
          position: relative;
          overflow-x: hidden;
        }

        .bg-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,87,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,87,255,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
        }

        .bg-glow {
          position: fixed;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 500px;
          background: radial-gradient(ellipse, rgba(99,87,255,0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .layout {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Header */
        .header {
          padding: 40px 0 32px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }

        .logo-mark {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6357ff, #a855f7);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 0 24px rgba(99,87,255,0.4);
        }

        .logo-text {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: #fff;
        }

        .logo-text span {
          color: #6357ff;
        }

        .header-badge {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #6357ff;
          background: rgba(99,87,255,0.1);
          border: 1px solid rgba(99,87,255,0.25);
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.5px;
        }

        /* Category tabs */
        .category-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 32px;
        }

        .cat-tab {
          flex: 1;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 16px 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          color: #888;
        }

        .cat-tab:hover {
          border-color: rgba(99,87,255,0.3);
          background: rgba(99,87,255,0.05);
          color: #ccc;
        }

        .cat-tab.active {
          background: rgba(99,87,255,0.1);
          border-color: rgba(99,87,255,0.5);
          color: #fff;
          box-shadow: 0 0 20px rgba(99,87,255,0.15);
        }

        .cat-icon {
          font-size: 20px;
          margin-bottom: 8px;
          display: block;
          font-style: normal;
        }

        .cat-label {
          font-size: 15px;
          font-weight: 700;
          display: block;
          letter-spacing: -0.3px;
        }

        .cat-desc {
          font-size: 11px;
          font-weight: 400;
          margin-top: 3px;
          display: block;
          opacity: 0.6;
          font-family: 'DM Mono', monospace;
        }

        /* Main grid */
        .main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          padding-bottom: 60px;
        }

        @media (max-width: 768px) {
          .main-grid { grid-template-columns: 1fr; }
          .category-tabs { flex-direction: column; }
        }

        /* Panels */
        .panel {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
        }

        .panel-header {
          padding: 18px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .panel-title {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #555;
          font-family: 'DM Mono', monospace;
        }

        .panel-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #6357ff;
          box-shadow: 0 0 8px rgba(99,87,255,0.8);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .panel-body {
          padding: 24px;
        }

        /* Question form overrides */
        .panel-body label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 8px;
          font-family: 'DM Mono', monospace;
        }

        .panel-body select {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #e8e6f0;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          padding: 10px 14px;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23666' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          transition: border-color 0.2s;
        }

        .panel-body select:focus {
          border-color: rgba(99,87,255,0.5);
        }

        .panel-body select option {
          background: #12131a;
        }

        /* Multi checkboxes */
        .multi-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .multi-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          font-size: 12px;
          color: #888;
          transition: all 0.15s ease;
          user-select: none;
          font-family: 'DM Mono', monospace;
        }

        .multi-chip:hover {
          border-color: rgba(99,87,255,0.3);
          color: #ccc;
        }

        .multi-chip.selected {
          background: rgba(99,87,255,0.15);
          border-color: rgba(99,87,255,0.5);
          color: #a89fff;
        }

        .multi-chip input[type="checkbox"] {
          display: none;
        }

        .chip-check {
          width: 14px;
          height: 14px;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          flex-shrink: 0;
        }

        .multi-chip.selected .chip-check {
          background: #6357ff;
          border-color: #6357ff;
        }

        /* Question block spacing */
        .q-block {
          margin-bottom: 24px;
        }

        .q-block:last-child {
          margin-bottom: 0;
        }

        /* Preview panel */
        .preview-panel {
          display: flex;
          flex-direction: column;
        }

        .preview-panel .panel-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .preview-content {
          flex: 1;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          line-height: 1.8;
          color: #9b99b0;
          white-space: pre-wrap;
          word-break: break-word;
          min-height: 200px;
          max-height: 520px;
          overflow-y: auto;
          padding: 16px;
          background: rgba(0,0,0,0.2);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
          scrollbar-width: thin;
          scrollbar-color: rgba(99,87,255,0.3) transparent;
        }

        .preview-content:empty::before {
          content: "Fill in the form to generate your prompt...";
          color: #333;
          font-style: italic;
        }

        .preview-actions {
          display: flex;
          gap: 10px;
        }

        .btn {
          flex: 1;
          padding: 12px 20px;
          border-radius: 12px;
          border: none;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.3px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6357ff, #8b5cf6);
          color: #fff;
          box-shadow: 0 4px 20px rgba(99,87,255,0.3);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(99,87,255,0.45);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #888;
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.08);
          color: #ccc;
          border-color: rgba(255,255,255,0.2);
        }

        .btn-success {
          background: rgba(34,197,94,0.15);
          border: 1px solid rgba(34,197,94,0.3);
          color: #4ade80;
        }

        /* Refined badge */
        .refined-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #a855f7;
          background: rgba(168,85,247,0.1);
          border: 1px solid rgba(168,85,247,0.25);
          padding: 3px 10px;
          border-radius: 20px;
        }

        /* Spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        /* Scrollbar */
        .preview-content::-webkit-scrollbar { width: 4px; }
        .preview-content::-webkit-scrollbar-track { background: transparent; }
        .preview-content::-webkit-scrollbar-thumb { background: rgba(99,87,255,0.3); border-radius: 2px; }

        /* Token count */
        .token-count {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #444;
          text-align: right;
        }
      `}</style>

      <div className="app">
        <div className="bg-grid" />
        <div className="bg-glow" />

        <div className="layout">
          {/* Header */}
          <header className="header">
            <div className="logo-mark">
              <div className="logo-icon">✦</div>
              <div className="logo-text">
                Prompt<span>Copilot</span>
              </div>
            </div>
            <div className="header-badge">v2.0 · AI-powered</div>
          </header>

          {/* Category tabs */}
          <div className="category-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`cat-tab ${category === cat.id ? "active" : ""}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                <i className="cat-icon">{cat.icon}</i>
                <span className="cat-label">{cat.label}</span>
                <span className="cat-desc">{cat.desc}</span>
              </button>
            ))}
          </div>

          {/* Main grid */}
          <div className="main-grid">
            {/* Left — Question form */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">Configure</span>
                <div className="panel-dot" />
              </div>
              <div className="panel-body">
                <QuestionForm
                  questions={questions}
                  answers={answers}
                  setAnswers={handleSetAnswers}
                />
              </div>
            </div>

            {/* Right — Preview */}
            <div className="panel preview-panel">
              <div className="panel-header">
                <span className="panel-title">Live Preview</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {isRefined && (
                    <span className="refined-badge">✦ AI refined</span>
                  )}
                  <div className="panel-dot" />
                </div>
              </div>
              <div className="panel-body">
                <div className="preview-content">{preview}</div>
                {preview && (
                  <div className="token-count">
                    ~{Math.ceil(preview.length / 4)} tokens
                  </div>
                )}
                <div className="preview-actions">
                  <button
                    className={`btn ${copied ? "btn-success" : "btn-secondary"}`}
                    onClick={copyToClipboard}
                    disabled={!preview}
                  >
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={refine}
                    disabled={!preview || isRefining}
                  >
                    {isRefining ? (
                      <>
                        <span className="spinner" /> Refining…
                      </>
                    ) : (
                      "✦ Improve Prompt"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
