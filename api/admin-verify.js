// 관리자 페이지 "입장" 비밀번호 확인 전용 (삭제는 admin-delete-report.js가 별도로 다시 검증함)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { password } = req.body || {}

  if (password && password === process.env.ADMIN_PASSWORD) {
    res.status(200).json({ success: true })
    return
  }

  res.status(401).json({ error: '비밀번호가 올바르지 않습니다' })
}
