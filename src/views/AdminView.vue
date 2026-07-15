<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { supabase } from '../lib/supabase'

const STATUS_LABEL = { ok: '정상 작동', broken: '고장', removed: '철거됨' }

const unlocked = ref(false)
const entryPassword = ref('')
const entryError = ref('')
const verifying = ref(false)

const loading = ref(false)
const error = ref('')
const reports = ref([])
const deviceNames = ref({})
const deletingId = ref(null)
const rowMessage = ref({})

const sortedReports = computed(() =>
  [...reports.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
)

async function load() {
  loading.value = true
  error.value = ''

  const [devicesRes, reportsRes] = await Promise.all([
    supabase.from('aed_devices').select('id,name'),
    supabase.from('reports').select('*'),
  ])

  if (devicesRes.error || reportsRes.error) {
    error.value = (devicesRes.error || reportsRes.error).message
    loading.value = false
    return
  }

  const names = {}
  devicesRes.data.forEach((d) => {
    names[d.id] = d.name
  })
  deviceNames.value = names
  reports.value = reportsRes.data
  loading.value = false
}

async function enter() {
  if (!entryPassword.value) return
  verifying.value = true
  entryError.value = ''
  try {
    const res = await fetch('/api/admin-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: entryPassword.value }),
    })
    if (res.ok) {
      unlocked.value = true
      entryPassword.value = ''
      await load()
    } else {
      const body = await res.json().catch(() => ({}))
      entryError.value = body.error || '비밀번호가 올바르지 않습니다'
    }
  } catch (e) {
    entryError.value = '요청 중 오류가 발생했어요'
  } finally {
    verifying.value = false
  }
}

async function deleteReport(reportId) {
  const password = window.prompt('삭제하려면 관리자 비밀번호를 다시 입력하세요')
  if (password === null) return
  if (!password) {
    rowMessage.value = { ...rowMessage.value, [reportId]: '비밀번호를 입력해주세요' }
    return
  }

  deletingId.value = reportId
  try {
    const res = await fetch('/api/admin-delete-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId, password }),
    })
    if (res.ok) {
      reports.value = reports.value.filter((r) => r.id !== reportId)
    } else {
      const body = await res.json().catch(() => ({}))
      rowMessage.value = { ...rowMessage.value, [reportId]: body.error || '삭제 실패' }
    }
  } catch (e) {
    rowMessage.value = { ...rowMessage.value, [reportId]: '요청 중 오류가 발생했어요' }
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <div class="page">
    <header class="topbar">
      <RouterLink to="/" class="back">← 홈</RouterLink>
      <h1 class="title">신고 내역 관리</h1>
      <span class="spacer"></span>
    </header>

    <div v-if="!unlocked" class="gate">
      <p class="gate-label">관리자 비밀번호</p>
      <input
        v-model="entryPassword"
        type="password"
        placeholder="비밀번호 입력"
        @keyup.enter="enter"
      />
      <button :disabled="verifying" @click="enter">
        {{ verifying ? '확인 중...' : '입장' }}
      </button>
      <p v-if="entryError" class="hint error">{{ entryError }}</p>
    </div>

    <div v-else class="content">
      <p v-if="loading" class="hint">불러오는 중...</p>
      <p v-if="error" class="hint error">{{ error }}</p>
      <p v-if="!loading && !error && sortedReports.length === 0" class="hint">
        등록된 신고 내역이 없습니다
      </p>

      <table v-if="sortedReports.length" class="table">
        <thead>
          <tr>
            <th>일시</th>
            <th>AED</th>
            <th>상태</th>
            <th>코멘트</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in sortedReports" :key="r.id">
            <td>{{ r.created_at.slice(0, 16).replace('T', ' ') }}</td>
            <td>{{ deviceNames[r.aed_id] || r.aed_id }}</td>
            <td>
              <span :class="['badge-mini', 'badge-mini-' + r.status]">{{ STATUS_LABEL[r.status] || r.status }}</span>
            </td>
            <td>{{ r.comment || '-' }}</td>
            <td>
              <button :disabled="deletingId === r.id" @click="deleteReport(r.id)">
                {{ deletingId === r.id ? '삭제 중...' : '삭제' }}
              </button>
              <p v-if="rowMessage[r.id]" class="row-error">{{ rowMessage[r.id] }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
}
.topbar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}
.back {
  justify-self: start;
  font-size: 14px;
  color: var(--accent);
  text-decoration: none;
}
.title {
  justify-self: center;
  font-size: 18px;
  font-weight: 800;
  color: var(--text-strong);
  margin: 0;
}
.gate {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 80px 24px;
}
.gate-label {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}
.gate input {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  padding: 10px 12px;
  font-size: 14px;
  width: 220px;
  text-align: center;
}
.gate button {
  background: var(--cta);
  color: var(--cta-text);
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}
.gate button:disabled {
  opacity: 0.6;
  cursor: default;
}
.content {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;
}
.hint {
  font-size: 13px;
  color: var(--text-muted);
}
.hint.error {
  color: #f87171;
}
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.table th {
  text-align: left;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 12px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--border);
}
.table td {
  padding: 8px 10px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}
.table button {
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: #f87171;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
}
.table button:disabled {
  opacity: 0.6;
  cursor: default;
}
.row-error {
  font-size: 11px;
  color: #f87171;
  margin: 4px 0 0;
}
.badge-mini {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 999px;
  white-space: nowrap;
}
.badge-mini-broken {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
}
.badge-mini-removed {
  background: rgba(248, 113, 113, 0.15);
  color: #f87171;
}
.badge-mini-ok {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
}
</style>
