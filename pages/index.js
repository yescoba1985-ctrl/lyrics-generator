import { useState, useEffect } from "react";

const GENRE_CATEGORIES = [
  { id: "all", label: "전체" },
  { id: "hiphop", label: "힙합 / 트랩" },
  { id: "rnb", label: "R&B / 소울" },
  { id: "pop", label: "팝 / 케이팝" },
  { id: "electronic", label: "일렉트로닉" },
  { id: "hyperpop", label: "하이퍼팝" },
  { id: "rock", label: "록 / 얼터너티브" },
  { id: "metal", label: "메탈 / 하드코어" },
  { id: "jazz", label: "재즈 / 블루스" },
  { id: "country", label: "컨트리 / 포크" },
  { id: "latin", label: "라틴 / 월드" }
];

const ALL_GENRES = [
  { id: "hiphop", name: "Trap" },
  { id: "hiphop", name: "Drill" },
  { id: "hiphop", name: "Boom Bap" },
  { id: "hiphop", name: "Cloud Rap" },
  { id: "hiphop", name: "Lo-fi Hip Hop" },
  { id: "hiphop", name: "Jersey Club" },
  { id: "hiphop", name: "Jerk" },
  { id: "hiphop", name: "Emo Trap" },
  { id: "hiphop", name: "2000s Swag" },
  { id: "hiphop", name: "Hood Trap" },
  { id: "hiphop", name: "Phonk" },
  { id: "hiphop", name: "Crunk" },
  { id: "rnb", name: "Neo Soul" },
  { id: "rnb", name: "Contemporary R&B" },
  { id: "rnb", name: "Alt R&B" },
  { id: "rnb", name: "Funk" },
  { id: "rnb", name: "Quiet Storm" },
  { id: "pop", name: "Synth Pop" },
  { id: "pop", name: "Dance Pop" },
  { id: "pop", name: "K-Pop" },
  { id: "pop", name: "J-Pop" },
  { id: "pop", name: "Bedroom Pop" },
  { id: "pop", name: "Teen Pop" },
  { id: "electronic", name: "House" },
  { id: "electronic", name: "Techno" },
  { id: "electronic", name: "Trance" },
  { id: "electronic", name: "Ambient" },
  { id: "electronic", name: "EDM" },
  { id: "electronic", name: "UK Garage" },
  { id: "electronic", name: "Drum & Bass" },
  { id: "hyperpop", name: "Hyperpop" },
  { id: "hyperpop", name: "Digicore" },
  { id: "hyperpop", name: "PC Music" },
  { id: "hyperpop", name: "Glitchcore" },
  { id: "hyperpop", name: "Bubblegum Bass" },
  { id: "rock", name: "Indie Rock" },
  { id: "rock", name: "Emo" },
  { id: "rock", name: "Post-Punk" },
  { id: "rock", name: "Shoegaze" },
  { id: "rock", name: "Grunge" },
  { id: "rock", name: "Math Rock" },
  { id: "metal", name: "Heavy Metal" },
  { id: "metal", name: "Metalcore" },
  { id: "metal", name: "Screamo" },
  { id: "metal", name: "Punk" },
  { id: "metal", name: "Hardcore" },
  { id: "jazz", name: "Jazz" },
  { id: "jazz", name: "Blues" },
  { id: "jazz", name: "Gospel" },
  { id: "jazz", name: "Nu Jazz" },
  { id: "jazz", name: "Soul Jazz" },
  { id: "country", name: "Country" },
  { id: "country", name: "Folk" },
  { id: "country", name: "Bluegrass" },
  { id: "country", name: "Americana" },
  { id: "country", name: "Singer-Songwriter" },
  { id: "latin", name: "Reggaeton" },
  { id: "latin", name: "Latin Pop" },
  { id: "latin", name: "Afrobeats" },
  { id: "latin", name: "Dancehall" },
  { id: "latin", name: "Reggae" }
];

const STRUCTURES = ["Verse1 + Hook + Verse2", "Verse1 + Hook + Verse2 + Hook", "Verse1 + Verse2", "Hook + Verse1 + Hook", "Verse + Bridge + Chorus"];
const VIBES = ["자신감 / 업템포", "다크 / 무거운", "감성 / 새벽", "릴렉스 / 여유", "하드 / 공격적", "몽환적 / 드리미", "에너지 / 파티", "슬픔 / 멜랑꼴리"];
const LANGUAGES = ["한영 믹스", "한국어", "English"];
const BARS = ["8", "12", "16", "24"];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [form, setForm] = useState({ theme: "", structure: STRUCTURES[0], vibe: VIBES[0], language: LANGUAGES[0], bars: "16" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState({});
  const [activeSection, setActiveSection] = useState("verse1");

  useEffect(() => setMounted(true), []);

  const filteredGenres = activeCategory === "all"
    ? ALL_GENRES
    : ALL_GENRES.filter(g => g.id === activeCategory);

  const toggleGenre = (name) => {
    setSelectedGenres(prev => {
      if (prev.includes(name)) return prev.filter(g => g !== name);
      if (prev.length >= 3) return prev;
      return [...prev, name];
    });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.theme) { setError("주제를 입력해주세요."); return; }
    if (selectedGenres.length === 0) { setError("장르를 최소 1개 선택해주세요."); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, genres: selectedGenres })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "오류 발생");
      setResult(data); setActiveSection("verse1");
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  const copyText = (key, text) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied({ ...copied, [key]: true });
    setTimeout(() => setCopied((c) => ({ ...c, [key]: false })), 1500);
  };

  const copyAll = () => {
    if (!result) return;
    copyText("all", `[VERSE 1]\n${result.verse1}\n\n[HOOK]\n${result.hook}\n\n[VERSE 2]\n${result.verse2}`);
  };

  if (!mounted) return null;

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Noto+Sans+KR:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f8f8f7; color: #1a1a1a; font-family: 'Inter', 'Noto Sans KR', sans-serif; min-height: 100vh; }
        .wrap { max-width: 780px; margin: 0 auto; padding: 48px 24px 80px; }
        .header { margin-bottom: 36px; padding-bottom: 24px; border-bottom: 1px solid #e8e8e6; }
        .eyebrow { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #888; margin-bottom: 10px; font-weight: 500; }
        .title { font-size: clamp(36px, 6vw, 56px); font-weight: 300; color: #1a1a1a; letter-spacing: -0.03em; line-height: 1; }
        .title strong { font-weight: 600; }
        .subtitle { font-size: 13px; color: #888; margin-top: 10px; line-height: 1.6; }
        .section { margin-bottom: 24px; }
        .section-label { font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #999; margin-bottom: 10px; }
        .cat-tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
        .cat-tab { padding: 5px 14px; border-radius: 999px; border: 1px solid #e0e0de; background: #fff; color: #666; font-size: 12px; cursor: pointer; transition: all 0.15s; font-weight: 500; }
        .cat-tab:hover { border-color: #bbb; color: #333; }
        .cat-tab.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
        .sub-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .sub-tag { padding: 5px 12px; border-radius: 6px; border: 1px solid #e0e0de; background: #fff; color: #666; font-size: 12px; cursor: pointer; transition: all 0.15s; }
        .sub-tag:hover { border-color: #aaa; color: #333; }
        .sub-tag.selected { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
        .sub-tag.disabled { opacity: 0.35; cursor: not-allowed; }
        .selected-wrap { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; min-height: 28px; }
        .selected-chip { display: flex; align-items: center; gap: 6px; padding: 4px 10px; background: #f0f0ee; border-radius: 6px; font-size: 12px; color: #444; }
        .chip-remove { cursor: pointer; color: #999; font-size: 16px; line-height: 1; }
        .genre-limit { font-size: 11px; color: #bbb; margin-top: 6px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .form-full { grid-column: 1 / -1; }
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field label { font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #999; }
        .field input, .field select, .field textarea { background: #fff; border: 1px solid #e0e0de; border-radius: 8px; color: #1a1a1a; font-family: 'Inter', 'Noto Sans KR', sans-serif; font-size: 14px; padding: 10px 14px; outline: none; width: 100%; transition: border-color 0.15s; }
        .field input:focus, .field select:focus, .field textarea:focus { border-color: #999; }
        .field textarea { resize: none; height: 80px; }
        .field input::placeholder, .field textarea::placeholder { color: #bbb; }
        .submit-btn { width: 100%; background: #1a1a1a; color: #fff; border: none; border-radius: 8px; font-size: 15px; font-weight: 500; letter-spacing: 0.04em; padding: 14px; cursor: pointer; margin-top: 8px; transition: opacity 0.15s; }
        .submit-btn:hover { opacity: 0.85; }
        .submit-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .error-msg { background: #fff2f2; border: 1px solid #ffd0d0; border-radius: 8px; color: #c0392b; font-size: 13px; padding: 10px 14px; margin-top: 10px; }
        .loading-wrap { display: flex; align-items: center; gap: 12px; padding: 28px 0; color: #999; font-size: 14px; }
        .spinner { width: 18px; height: 18px; border: 2px solid #e0e0de; border-top-color: #1a1a1a; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .divider { height: 1px; background: #e8e8e6; margin: 32px 0; }
        .result-meta { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; gap: 12px; }
        .result-theme { font-size: 22px; font-weight: 500; color: #1a1a1a; letter-spacing: -0.02em; }
        .result-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 5px; }
        .result-tag { font-size: 11px; padding: 3px 8px; background: #f0f0ee; border-radius: 4px; color: #666; }
        .vibe-note { font-size: 12px; color: #999; margin-top: 5px; font-style: italic; }
        .copy-all-btn { background: #fff; border: 1px solid #e0e0de; color: #666; border-radius: 6px; font-size: 12px; padding: 6px 14px; cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: all 0.15s; }
        .copy-all-btn:hover { border-color: #999; color: #333; }
        .section-tabs { display: flex; gap: 4px; margin-bottom: 14px; border-bottom: 1px solid #e8e8e6; }
        .stab { padding: 8px 16px; font-size: 13px; font-weight: 500; color: #999; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.15s; }
        .stab.active { color: #1a1a1a; border-bottom-color: #1a1a1a; }
        .lyrics-card { background: #fff; border: 1px solid #e8e8e6; border-radius: 10px; padding: 22px 24px; position: relative; min-height: 180px; }
        .lyrics-text { font-size: 15px; line-height: 2.1; color: #2a2a2a; white-space: pre-line; font-family: 'Noto Sans KR', sans-serif; }
        .copy-btn { position: absolute; top: 14px; right: 14px; background: #f8f8f7; border: 1px solid #e0e0de; color: #888; border-radius: 6px; font-size: 11px; padding: 4px 10px; cursor: pointer; }
        .rhyme-note { margin-top: 12px; border-left: 3px solid #e0e0de; border-radius: 0; padding: 8px 14px; font-size: 12px; color: #999; line-height: 1.6; }
        @media (max-width: 480px) { .form-grid { grid-template-columns: 1fr; } .result-meta { flex-direction: column; } }
      `}</style>

      <div className="wrap">
        <header className="header">
          <div className="eyebrow">AI Songwriting Studio</div>
          <h1 className="title">Lyrics <strong>Generator</strong></h1>
          <p className="subtitle">장르를 선택하고 주제를 입력하면 그에 맞는 가사를 만들어줘. 카테고리 넘어서 최대 3개 장르 믹스 가능.</p>
        </header>

        <div className="section">
          <div className="section-label">장르 선택 (최대 3개 — 카테고리 무관)</div>
          <div className="cat-tabs">
            {GENRE_CATEGORIES.map(c => (
              <button key={c.id} className={`cat-tab ${activeCategory === c.id ? "active" : ""}`}
                onClick={() => setActiveCategory(c.id)}>{c.label}</button>
            ))}
          </div>
          <div className="sub-tags">
            {filteredGenres.map(g => {
              const isSel = selectedGenres.includes(g.name);
              const isDisabled = !isSel && selectedGenres.length >= 3;
              return (
                <button key={g.name}
                  className={`sub-tag ${isSel ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
                  onClick={() => !isDisabled && toggleGenre(g.name)}>{g.name}</button>
              );
            })}
          </div>
          {selectedGenres.length > 0 && (
            <div className="selected-wrap">
              {selectedGenres.map(g => (
                <div key={g} className="selected-chip">
                  {g}
                  <span className="chip-remove" onClick={() => toggleGenre(g)}>×</span>
                </div>
              ))}
            </div>
          )}
          <div className="genre-limit">{selectedGenres.length}/3 선택됨</div>
        </div>

        <div className="section">
          <div className="form-grid">
            <div className="field form-full">
              <label>주제 / 감정 *</label>
              <textarea name="theme" value={form.theme} onChange={handleChange}
                placeholder="예: 새벽 드라이브, 이별 후의 해방감, 성공의 외로움..." />
            </div>
            <div className="field">
              <label>구조</label>
              <select name="structure" value={form.structure} onChange={handleChange}>
                {STRUCTURES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="field">
              <label>언어</label>
              <select name="language" value={form.language} onChange={handleChange}>
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="field">
              <label>분위기</label>
              <select name="vibe" value={form.vibe} onChange={handleChange}>
                {VIBES.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="field">
              <label>마디 수</label>
              <select name="bars" value={form.bars} onChange={handleChange}>
                {BARS.map(b => <option key={b}>{b}마디</option>)}
              </select>
            </div>
          </div>
          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "가사 작업 중..." : "가사 생성하기"}
          </button>
          {error && <div className="error-msg">{error}</div>}
          {loading && <div className="loading-wrap"><div className="spinner" />AI가 가사 쓰는 중... 잠깐만</div>}
        </div>

        {result && (
          <div>
            <div className="divider" />
            <div className="result-meta">
              <div>
                <div className="result-theme">{form.theme}</div>
                <div className="result-tags">
                  {selectedGenres.map(g => <span key={g} className="result-tag">{g}</span>)}
                  <span className="result-tag">{form.vibe}</span>
                </div>
                {result.vibe_note && <div className="vibe-note">"{result.vibe_note}"</div>}
              </div>
              <button className="copy-all-btn" onClick={copyAll}>
                {copied.all ? "복사됨 ✓" : "전체 복사"}
              </button>
            </div>
            <div className="section-tabs">
              {[{key:"verse1",label:"Verse 1"},{key:"hook",label:"Hook"},{key:"verse2",label:"Verse 2"}].map(s => (
                <div key={s.key} className={`stab ${activeSection === s.key ? "active" : ""}`}
                  onClick={() => setActiveSection(s.key)}>{s.label}</div>
              ))}
            </div>
            <div className="lyrics-card">
              <button className="copy-btn" onClick={() => copyText(activeSection, result[activeSection])}>
                {copied[activeSection] ? "✓" : "복사"}
              </button>
              <div className="lyrics-text">{result[activeSection]}</div>
            </div>
            {result.rhyme_scheme && <div className="rhyme-note">{result.rhyme_scheme}</div>}
          </div>
        )}
      </div>
    </div>
  );
}