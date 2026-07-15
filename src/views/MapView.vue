<script setup>
import { computed, onMounted, ref, shallowRef } from 'vue'
import { RouterLink } from 'vue-router'
import { loadKakaoMaps } from '../lib/kakao'
import { distanceKm, formatDistance } from '../lib/geo'
import { useAedStore } from '../stores/aed'

const HWASEONG_CENTER = { lat: 37.1996, lng: 126.8312 }

const store = useAedStore()
const mapEl = ref(null)
const map = shallowRef(null)
const kakaoRef = shallowRef(null)
const meMarker = shallowRef(null)
const hoverOverlay = shallowRef(null)

const selected = ref(null)
const query = ref('')
const userLocation = ref(null)
const locating = ref(false)
const mapError = ref(null)

const reportStatus = ref('ok')
const reportComment = ref('')
const submitting = ref(false)
const successMessage = ref('')

const STATUS_LABEL = { ok: '정상 작동', broken: '고장', removed: '철거됨' }

function summarize(aedId) {
  const reports = store.reportsByDevice[aedId] || []
  if (reports.length === 0) return { lastChecked: null, count: 0 }
  return { lastChecked: reports[0].created_at, count: reports.length }
}

function buildHoverContent(device) {
  const reports = (store.reportsByDevice[device.id] || []).slice(0, 3)
  const rows = reports.length
    ? reports
        .map(
          (r) =>
            `<div style="display:flex;justify-content:space-between;gap:10px;padding:3px 0;">
              <span style="color:#94a3b8;">${r.created_at.slice(0, 10)}</span>
              <span style="color:#e2e8f0;font-weight:600;">${STATUS_LABEL[r.status] || r.status}</span>
            </div>`,
        )
        .join('')
    : '<div style="color:#94a3b8;">등록된 신고 이력이 없습니다</div>'

  return `
    <div style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:10px 14px;
                box-shadow:0 4px 16px rgba(0,0,0,0.4);font-size:12px;min-width:180px;
                font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <div style="color:#ffffff;font-weight:700;margin-bottom:6px;">${device.name}</div>
      ${rows}
    </div>
  `
}

const referenceCenter = computed(() => userLocation.value || HWASEONG_CENTER)

const filteredSortedDevices = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = store.devices
    .filter((d) => !q || `${d.name} ${d.address}`.toLowerCase().includes(q))
    .map((d) => ({
      ...d,
      _distance:
        d.lat && d.lng
          ? distanceKm(referenceCenter.value.lat, referenceCenter.value.lng, d.lat, d.lng)
          : null,
    }))
  list.sort((a, b) => (a._distance ?? Infinity) - (b._distance ?? Infinity))
  return list
})

async function focusDevice(device) {
  selected.value = device
  reportStatus.value = 'ok'
  reportComment.value = ''
  await store.fetchReports(device.id)
  if (map.value && device.lat && device.lng) {
    map.value.panTo(new kakaoRef.value.maps.LatLng(device.lat, device.lng))
  }
}

async function submitReport() {
  if (!selected.value) return
  submitting.value = true
  const error = await store.submitReport(selected.value.id, reportStatus.value, reportComment.value)
  submitting.value = false
  reportComment.value = ''

  if (!error) {
    successMessage.value = '신고가 등록되었습니다'
    setTimeout(() => {
      successMessage.value = ''
    }, 2500)
  }
}

function placeMarkers(kakao) {
  if (!hoverOverlay.value) {
    hoverOverlay.value = new kakao.maps.CustomOverlay({ yAnchor: 1.3 })
  }

  store.devices.forEach((device) => {
    if (!device.lat || !device.lng) return
    const position = new kakao.maps.LatLng(device.lat, device.lng)
    const marker = new kakao.maps.Marker({ position, map: map.value })

    kakao.maps.event.addListener(marker, 'click', () => focusDevice(device))
    kakao.maps.event.addListener(marker, 'mouseover', () => {
      hoverOverlay.value.setContent(buildHoverContent(device))
      hoverOverlay.value.setPosition(position)
      hoverOverlay.value.setMap(map.value)
    })
    kakao.maps.event.addListener(marker, 'mouseout', () => {
      hoverOverlay.value.setMap(null)
    })
  })
}

function locateMe() {
  if (!navigator.geolocation) {
    alert('이 브라우저는 위치 확인을 지원하지 않아요.')
    return
  }
  locating.value = true
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords
      userLocation.value = { lat: latitude, lng: longitude }
      locating.value = false

      const kakao = kakaoRef.value
      const pt = new kakao.maps.LatLng(latitude, longitude)
      map.value.panTo(pt)

      if (meMarker.value) meMarker.value.setMap(null)
      meMarker.value = new kakao.maps.Marker({
        position: pt,
        map: map.value,
        image: new kakao.maps.MarkerImage(
          'data:image/svg+xml;base64,' +
            btoa(
              '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="8" fill="%234285F4" stroke="white" stroke-width="3"/></svg>'.replace(
                /%23/g,
                '#',
              ),
            ),
          new kakao.maps.Size(20, 20),
        ),
      })
    },
    () => {
      locating.value = false
      alert('위치 확인에 실패했어요. 브라우저 위치 권한을 확인해주세요.')
    },
  )
}

onMounted(async () => {
  try {
    const kakao = await loadKakaoMaps()
    kakaoRef.value = kakao
    map.value = new kakao.maps.Map(mapEl.value, {
      center: new kakao.maps.LatLng(HWASEONG_CENTER.lat, HWASEONG_CENTER.lng),
      level: 5,
    })

    await store.fetchDevices()
    await store.fetchAllReports()
    placeMarkers(kakao)
  } catch (e) {
    mapError.value = '카카오맵을 불러오지 못했어요. .env의 VITE_KAKAO_JS_KEY가 올바른지 확인해주세요.'
  }
})
</script>

<template>
  <div class="page">
    <header class="topbar">
      <RouterLink to="/" class="back">← 홈</RouterLink>
      <h1 class="title">AED 지도</h1>
      <button class="locate-btn" :disabled="locating" @click="locateMe">
        {{ locating ? '위치 확인 중...' : '📍 현재 위치' }}
      </button>
    </header>

    <div class="body">
      <aside class="sidebar">
        <input v-model="query" class="search" placeholder="장소명, 주소로 검색" />

        <div v-if="!selected" class="list">
          <p v-if="store.loading" class="hint">AED 위치를 불러오는 중...</p>
          <div
            v-for="d in filteredSortedDevices"
            :key="d.id"
            class="list-item"
            @click="focusDevice(d)"
          >
            <div class="list-item-main">
              <p class="name">{{ d.name }}</p>
              <p class="address">{{ d.address }}</p>
            </div>
            <span v-if="d._distance != null" class="distance">{{ formatDistance(d._distance) }}</span>
          </div>
        </div>

        <div v-else class="detail">
          <button class="back-to-list" @click="selected = null">← 목록으로</button>
          <p class="name">{{ selected.name }}</p>
          <p class="address">{{ selected.address }} · {{ selected.operating_hours || '운영시간 정보 없음' }}</p>
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
            <p v-if="successMessage" class="success-msg">✓ {{ successMessage }}</p>
          </div>
        </div>

        <p v-if="store.error" class="hint error">{{ store.error }}</p>
      </aside>

      <div class="map-wrap">
        <div ref="mapEl" class="map"></div>
        <p v-if="mapError" class="hint error map-overlay-error">{{ mapError }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
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
.topbar .locate-btn {
  justify-self: end;
}
.body {
  flex: 1;
  display: flex;
  min-height: 0;
}
.sidebar {
  width: 320px;
  flex: none;
  background: var(--bg-card);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.search {
  margin: 12px;
  padding: 8px 10px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 13px;
}
.search::placeholder {
  color: var(--text-muted);
}
.list {
  flex: 1;
  overflow-y: auto;
}
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
}
.list-item:hover {
  background: rgba(56, 189, 248, 0.08);
}
.list-item .name {
  font-weight: 700;
  font-size: 13px;
  color: var(--text-strong);
  margin: 0 0 2px;
}
.list-item .address {
  font-size: 11px;
  color: var(--text-muted);
  margin: 0;
}
.distance {
  font-size: 11px;
  color: var(--accent);
  font-weight: 600;
  white-space: nowrap;
  flex: none;
}
.detail {
  padding: 14px;
  overflow-y: auto;
}
.back-to-list {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 13px;
  padding: 0;
  margin-bottom: 12px;
  cursor: pointer;
}
.detail .name {
  font-weight: 700;
  color: var(--text-strong);
  margin: 0 0 2px;
}
.detail .address {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
}
.meta {
  font-size: 12px;
  color: var(--text-muted);
  margin: 8px 0 12px;
}
.success-msg {
  font-size: 12px;
  font-weight: 700;
  color: #4ade80;
  margin: 4px 0 0;
}
.report-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.report-form select,
.report-form input {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  padding: 8px 10px;
  font-size: 13px;
}
.report-form button {
  background: var(--cta);
  color: var(--cta-text);
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}
.report-form button:disabled {
  opacity: 0.6;
  cursor: default;
}
.map-wrap {
  flex: 1;
  position: relative;
}
.map {
  width: 100%;
  height: 100%;
}
.locate-btn {
  background: var(--bg-card);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}
.locate-btn:hover {
  border-color: var(--accent);
}
.locate-btn:disabled {
  opacity: 0.6;
  cursor: default;
}
.map-overlay-error {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}
.hint {
  padding: 8px 14px;
  font-size: 13px;
  color: var(--text-muted);
}
.hint.error {
  color: #f87171;
}

@media (max-width: 720px) {
  .body {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    height: 40%;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
  .map-wrap {
    flex: 1;
  }
}
</style>
