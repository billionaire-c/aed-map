<script setup>
import { RouterLink } from 'vue-router'

const stats = [
  { label: '연간 심정지 발생', value: '33,586', unit: '건' },
  { label: '1분 지연마다 생존율', value: '-10', unit: '%' },
  { label: 'AED 사용 시 생존율', value: '3', unit: '배' },
]
</script>

<template>
  <div class="home">
    <svg
      class="bg-illust"
      viewBox="0 0 700 460"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <path
        d="M470 60 a34 34 0 1 1 0.1 0 Z M420 130 q50 -28 100 0 l30 18 q14 9 14 26 l0 226 l-188 0 l0 -226 q0 -17 14 -26 Z"
        fill="#38bdf8"
        opacity="0.5"
      />
      <rect x="428" y="170" width="44" height="62" rx="8" fill="#cfe9fb" opacity="0.85" />
      <rect x="500" y="260" width="58" height="40" rx="8" fill="#cfe9fb" opacity="0.85" />
      <path
        d="M210 300 q0 40 60 40 q90 0 120 -55 q18 -33 45 -55"
        stroke="#e8f4fd"
        stroke-width="7"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M235 305 q10 55 105 48 q95 -7 150 -50 q20 -16 32 -20"
        stroke="#e8f4fd"
        stroke-width="7"
        fill="none"
        opacity="0.7"
      />
      <rect x="105" y="60" width="160" height="240" rx="18" fill="#1e3a5f" />
      <rect
        x="105"
        y="60"
        width="160"
        height="240"
        rx="18"
        stroke="#7dd3fc"
        stroke-width="3"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M135 60 q0 -22 22 -22 l56 0 q22 0 22 22"
        stroke="#7dd3fc"
        stroke-width="3"
        fill="none"
        opacity="0.9"
      />
      <circle cx="128" cy="88" r="5" fill="#7dd3fc" />
      <circle cx="146" cy="88" r="5" fill="#38bdf8" />
      <rect x="160" y="76" width="60" height="26" rx="4" fill="#cfe9fb" opacity="0.7" />
      <rect x="122" y="120" width="126" height="126" rx="12" fill="#38bdf8" opacity="0.35" />
      <path
        d="M185 200 c-24 -18 -34 -34 -22 -47 c9 -10 22 -6 22 4 c0 -10 13 -14 22 -4 c12 13 2 29 -22 47 Z"
        fill="#e8f4fd"
        opacity="0.95"
      />
      <text
        x="185"
        y="230"
        text-anchor="middle"
        fill="#e8f4fd"
        font-size="22"
        font-weight="700"
        opacity="0.95"
      >AED</text>
    </svg>

    <div class="content">
      <p class="eyebrow">화성시 공공안전 서비스</p>
      <h1 class="headline">심정지 골든타임 4분,<br />가장 가까운 AED를 찾아드립니다</h1>
      <p class="stat-line">화성시 전역 <strong>1,077대</strong> AED 실시간 위치 정보 · 공공데이터 기반</p>

      <nav class="cards">
        <RouterLink to="/map" class="card">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 21c-4-4.5-7-8-7-11a7 7 0 0 1 14 0c0 3-3 6.5-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          <span class="label">위치 보기</span>
          <span class="desc">내 주변 AED를 지도에서 확인</span>
        </RouterLink>
        <RouterLink to="/guide" class="card">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
          <span class="label">사용법</span>
          <span class="desc">AED 사용 영상과 단계별 매뉴얼</span>
        </RouterLink>
      </nav>

      <RouterLink to="/map?emergency=1" class="emergency-cta">
        <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 4 L21 19 H3 Z" />
          <line x1="12" y1="10" x2="12" y2="14" />
          <circle cx="12" cy="16.5" r="0.4" />
        </svg>
        <span class="cta-label">지금 응급 상황인가요?</span>
        <span class="cta-desc">버튼 한 번으로 즉시 안내</span>
        <svg class="icon-sm arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="4" y1="12" x2="20" y2="12" />
          <path d="M14 6l6 6-6 6" />
        </svg>
      </RouterLink>

      <div class="stats">
        <div v-for="s in stats" :key="s.label" class="stat">
          <p class="stat-label">{{ s.label }}</p>
          <p class="stat-value">{{ s.value }}<span class="stat-unit">{{ s.unit }}</span></p>
        </div>
      </div>
      <p class="stat-source">출처: 질병관리청 급성심장정지조사(2023) 등</p>
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
}
.bg-illust {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.13;
  pointer-events: none;
}
.content {
  position: relative;
  width: 100%;
  max-width: 560px;
  text-align: center;
}
.eyebrow {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 3px;
  color: #7dd3fc;
  margin: 0 0 12px;
}
.headline {
  font-size: 34px;
  font-weight: 700;
  color: var(--text-strong);
  line-height: 1.35;
  letter-spacing: -0.5px;
  margin: 0 0 10px;
}
.stat-line {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0 0 28px;
}
.stat-line strong {
  color: var(--text);
  font-weight: 600;
}
.cards {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 22px 16px;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s, transform 0.15s;
}
.card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}
.card .icon {
  width: 26px;
  height: 26px;
  color: #7dd3fc;
  margin-bottom: 6px;
}
.card .label {
  font-weight: 600;
  font-size: 16px;
  color: var(--text-strong);
}
.card .desc {
  font-size: 12px;
  color: var(--text-muted);
}
.emergency-cta {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border: 1px solid #f87171;
  border-radius: 12px;
  background: rgba(69, 10, 10, 0.45);
  text-decoration: none;
  margin-bottom: 26px;
  transition: background 0.15s;
}
.emergency-cta:hover {
  background: rgba(69, 10, 10, 0.65);
}
.icon-sm {
  width: 17px;
  height: 17px;
  color: #f87171;
  flex: none;
}
.cta-label {
  font-size: 13px;
  font-weight: 600;
  color: #f87171;
  white-space: nowrap;
}
.cta-desc {
  font-size: 12px;
  color: #fca5a5;
}
.emergency-cta .arrow {
  margin-left: auto;
}
.stats {
  display: flex;
  border-top: 1px solid rgba(148, 163, 184, 0.25);
  padding-top: 16px;
}
.stat {
  flex: 1;
  text-align: center;
  border-right: 1px solid rgba(148, 163, 184, 0.25);
}
.stat:last-child {
  border-right: none;
}
.stat-label {
  font-size: 11px;
  letter-spacing: 1px;
  color: #7dd3fc;
  margin: 0;
}
.stat-value {
  font-size: 26px;
  font-weight: 600;
  color: var(--text-strong);
  margin: 4px 0 0;
}
.stat-unit {
  font-size: 12px;
  font-weight: 400;
  color: var(--text-muted);
  margin-left: 2px;
}
.stat-source {
  font-size: 11px;
  color: var(--text-muted);
  opacity: 0.7;
  margin: 10px 0 0;
  text-align: right;
}

@media (max-width: 480px) {
  .headline {
    font-size: 25px;
  }
  .cards {
    flex-direction: column;
  }
  .card {
    flex-direction: row;
    justify-content: flex-start;
    gap: 12px;
    padding: 14px 16px;
    text-align: left;
  }
  .card .icon {
    margin-bottom: 0;
  }
  .card .desc {
    margin-left: auto;
  }
  .cta-desc {
    display: none;
  }
  .stat-value {
    font-size: 21px;
  }
  .stat-label {
    font-size: 10px;
    letter-spacing: 0.5px;
  }
}
</style>
