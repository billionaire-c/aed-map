// AED 사용법 페이지의 AI Q&A 챗봇 — 질문을 Anthropic API로 전달하고 답변만 돌려준다.
// 필요한 환경변수: ANTHROPIC_API_KEY (Vercel Settings > Environment Variables에 추가, 클라이언트에는 노출되지 않음)

const SYSTEM_PROMPT = `당신은 화성시 AED 지도 서비스의 응급처치 안내 도우미입니다.
자동심장충격기(AED) 사용법, 심폐소생술(CPR), 심정지 응급대응과 직접 관련된 질문에만 한국어로 답하세요.
의학적 진단이나 처방은 하지 말고, 그 자리에서 바로 할 수 있는 행동요령 위주로 3~5문장 이내로 간결하게 답하세요.
답변 끝에는 응급 상황이면 즉시 119에 신고하라고 안내하세요.
AED·CPR·응급처치와 무관한 질문에는 "이 기능은 AED 사용법 관련 질문만 답변할 수 있어요"라고 정중히 안내하고 다른 답은 하지 마세요.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { question } = req.body || {}

  if (typeof question !== 'string' || !question.trim()) {
    res.status(400).json({ error: '질문을 입력해주세요' })
    return
  }
  if (question.length > 300) {
    res.status(400).json({ error: '질문은 300자 이내로 입력해주세요' })
    return
  }

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: question.trim() }],
      }),
    })

    if (!resp.ok) {
      res.status(502).json({ error: 'AI 응답을 받아오지 못했어요' })
      return
    }

    const data = await resp.json()
    const answer = data.content?.[0]?.text || '답변을 생성하지 못했어요'
    res.status(200).json({ answer })
  } catch (err) {
    res.status(500).json({ error: '서버 오류가 발생했어요' })
  }
}
