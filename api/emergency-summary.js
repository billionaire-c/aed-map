// 지도 화면의 "🚨 응급 상황" 원탭 버튼 — 가장 가까운 AED 정보를 받아 즉시 행동 요약을 생성한다.
// 필요한 환경변수: ANTHROPIC_API_KEY (aed-assistant.js와 동일한 키 재사용)

const SYSTEM_PROMPT = `당신은 화성시 AED 지도 서비스의 응급 상황 즉시 대응 안내자입니다.
사용자는 지금 심정지가 의심되는 응급 상황에 처해 있습니다.
아래 형식으로 한국어로, 번호 매긴 목록 4~5개 이내로 즉시 행동 요령만 간결하게 답하세요.
AED까지 거리가 200m 이하로 가까우면 "먼저 AED를 가져온 뒤 심폐소생술을 시작하라"고 안내하고,
200m를 초과하면 "즉시 심폐소생술부터 시작하고 주변 사람에게 AED를 가져와 달라고 요청하라"고 안내하세요.
목록 마지막 항목은 반드시 "즉시 119에 신고하세요"로 끝내세요.
설명이나 배경 지식은 넣지 말고 지금 당장 할 행동만 나열하세요.
중요: AED의 구체적인 이름이나 주소는 이미 화면에 따로 표시되고 있으니, 답변에서 절대로 기기 이름·주소·건물명을 언급하거나 지어내지 마세요. "가까운 AED", "AED" 같은 일반 표현만 쓰세요.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { deviceName, distanceMeters } = req.body || {}

  if (typeof deviceName !== 'string' || !deviceName.trim()) {
    res.status(400).json({ error: 'deviceName이 필요합니다' })
    return
  }
  if (typeof distanceMeters !== 'number' || !Number.isFinite(distanceMeters) || distanceMeters < 0) {
    res.status(400).json({ error: 'distanceMeters가 필요합니다' })
    return
  }

  const userContent = `가장 가까운 AED까지 거리: 약 ${Math.round(distanceMeters)}m`

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
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userContent }],
      }),
    })

    if (!resp.ok) {
      res.status(502).json({ error: 'AI 응답을 받아오지 못했어요' })
      return
    }

    const data = await resp.json()
    const summary = data.content?.[0]?.text || '요약을 생성하지 못했어요'
    res.status(200).json({ summary })
  } catch (err) {
    res.status(500).json({ error: '서버 오류가 발생했어요' })
  }
}
