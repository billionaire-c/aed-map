<script setup>
import { onMounted, ref, shallowRef } from 'vue'
import { RouterLink } from 'vue-router'
import { loadKakaoMaps } from '../lib/kakao'
import { useAedStore } from '../stores/aed'

const HWASEONG_CENTER = { lat: 37.1996, lng: 126.8312 }

const store = useAedStore()
const mapEl = ref(null)
const map = shallowRef(null)
const selected = ref(null)
const reportStatus = ref('ok')
const reportComment = ref('')
const submitting = ref(false)
const mapError = ref(null)

const statusLabel = {
  ok: '정상 작동',
  broken: '고장',
  removed: '철거됨',
}

function summarize(aedId) {
  const reports = store.reportsByDevice[aedId] || []
  if (reports.length === 0) {
    return { lastChecked: null, count: 0 }
  }
  return { lastChecked: reports[0].created_at, count: reports.length }
}

async function selectDevice(device) {
  selected.value = device
  reportStatus.value = 'ok'
  reportComment.value = ''
  await store.fetchReports(device.id)
}

async function submitReport() {
  if (!selected.value) return
  submitting.value = true
  await store.submitReport(selected.value.id, reportStatus.value, reportComment.value)
  submitting.value = false
  reportComment.value = ''
}

function placeMarkers(kakao) {
  store.devices.forEach((device) => {
    if (!device.lat || !device.lng) return
    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(device.lat, device.lng),
      map: map.value,
    })
    kakao.maps.event.addListener(marker, 'click', () => selectDevice(device))
  })
}

onMounted(async () => {
  try {
    const kakao = await loadKakaoMaps()
    map.value = new kakao.maps.Map(mapEl.value, {
      center: new kakao.maps.LatLng(HWASEONG_CENTER.lat, HWASEONG_CENTER.lng),
      level: 5,
    })

    await store.fetchDevices()
    placeMarkers(kakao)
  } catch (e) {
    mapError.value = '카카오맵을 불러오지 못했어요. .env의 VITE_KAKAO_JS_KEY가 올바른지 확인해주세요.'
  }
})
</script>

<template>
  <div class="page">
    <header class="topbar">
      <span class="title">AED 지도</span>
      <RouterLink to="/guide" class="guide-link">사용법</RouterLink>
    </header>

    <div ref="mapEl" class="map"></div>

    <p v-if="mapError" class="hint error">{{ mapError }}</p>
    <p v-if="store.loading" class="hint">AED 위치를 불러오는 중...</p>
    <p v-if="store.error" class="hint error">{{ store.error }}</p>

    <div v-if="selected" class="detail">
      <div class="detail-head">
        <div>
          <p class="name">{{ selected.name }}</p>
          <p class="address">{{ selected.address }} · {{ selected.operating_hours || '운영시간 정보 없음' }}</p>
        </div>
      </div>
      <p class="meta">
        최근 확인 {{ summarize(selected.id).lastChecked?.slice(0, 10) || '기록 없음' }}
        · 신고 {{ summarize(selected.id).count }}건
      </p>

      <div class="report-form">
        <select v-model="reportStatus">
          <option value="ok">정상 작동</option>
          <option value="broken">고장</option>
          <option value="removed">철거됨</option>
        </select>
        <input v-model="reportComment" placeholder="추가 코멘트 (선택)" />
        <button :disabled="submitting" @click="submitReport">
          {{ submitting ? '등록 중...' : '신고 등록' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e5e5;
}
.title {
  font-weight: 600;
  font-size: 16px;
}
.guide-link {
  font-size: 14px;
  color: #1a5fb4;
  text-decoration: none;
}
.map {
  flex: 1;
  min-height: 200px;
}
.hint {
  padding: 8px 16px;
  font-size: 13px;
  color: #666;
}
.hint.error {
  color: #c0392b;
}
.detail {
  border-top: 1px solid #e5e5e5;
  padding: 14px 16px;
}
.name {
  font-weight: 600;
  margin: 0 0 2px;
}
.address {
  font-size: 12px;
  color: #666;
  margin: 0;
}
.meta {
  font-size: 12px;
  color: #999;
  margin: 8px 0 12px;
}
.report-form {
  display: flex;
  gap: 8px;
}
.report-form select {
  flex: none;
}
.report-form input {
  flex: 1;
}
</style>
