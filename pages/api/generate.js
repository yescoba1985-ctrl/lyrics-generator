export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { theme, structure, vibe, language, bars, genres } = req.body;
  if (!theme) return res.status(400).json({ error: "주제를 입력해주세요." });
  if (!genres || genres.length === 0) return res.status(400).json({ error: "장르를 선택해주세요." });

  const genreStr = genres.join(" + ");
  const isMixed = genres.length > 1;

  const prompt = `너는 다양한 음악 장르에 정통한 전문 작사가야.
${isMixed ? `${genreStr} 장르가 믹스된 독특한 스타일로` : `${genreStr} 장르 스타일로`} 가사를 써줘.

장르: ${genreStr}${isMixed ? " (이 장르들의 특성을 자연스럽게 blend해줘)" : ""}
주제/감정: ${theme}
구조: ${structure}
언어: ${language}
분위기: ${vibe}
마디 수: 벌스 ${bars}마디, 훅 8마디

장르별 특성 반영:
- 힙합/트랩 계열: 한영 믹스, 슬랭, 라임
- Jersey Club: 빠른 비트감, 반복적 훅
- Emo Trap: 감성적이고 취약한 감정 표현
- R&B/소울: 멜로딕하고 감성적
- 팝/케이팝: 캐치한 훅, 공감가는 가사
- 일렉트로닉: 반복적 phrase, 무드 중심
- 록/얼터너티브: 직접적이고 감정적
- 하이퍼팝: 과장된 감정, 인터넷 슬랭

백틱 없이 순수 JSON만 출력:
{"verse1":"벌스1 가사(줄바꿈은 \\n)","hook":"훅 가사","verse2":"벌스2 가사","rhyme_scheme":"장르에 맞는 라임/구성 설명","vibe_note":"이 가사의 전체 느낌 한줄"}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-4-5", max_tokens: 2048, messages: [{ role: "user", content: prompt }] })
    });
    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: "API 오류: " + (data.error?.message || "알 수 없는 오류") });
    const raw = data.content[0].text.replace(/```json|```/g, "").trim();
    return res.status(200).json(JSON.parse(raw));
  } catch (error) {
    return res.status(500).json({ error: "서버 오류: " + error.message });
  }
}