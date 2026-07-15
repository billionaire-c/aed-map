// Vercel 서버리스 함수 — 신고 내역 삭제는 비밀번호를 서버에서 검증한 뒤,
// service_role 키(클라이언트에 절대 노출되지 않음)로만 수행한다.
// 필요한 환경변수 (Vercel Settings > Environment Variables에 추가):
//   ADMIN_PASSWORD, SUPABASE_SERVICE_ROLE_KEY
//   (VITE_SUPABASE_URL은 이미 등록돼 있어 그대로 재사용 — 서버 함수는 VITE_ 접두사와 무관하게 읽을 수 있음)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { reportId, password } = req.body || {}

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: '비밀번호가 올바르지 않습니다' })
    return
  }

  if (!reportId) {
    res.status(400).json({ error: 'reportId가 필요합니다' })
    return
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const resp = await fetch(`${supabaseUrl}/rest/v1/reports?id=eq.${reportId}`, {
    method: 'DELETE',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
  })

  if (!resp.ok) {
    res.status(500).json({ error: '삭제 중 오류가 발생했어요' })
    return
  }

  res.status(200).json({ success: true })
}
