<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="home">
    <p class="brand">AED 지도</p>
    <h1 class="headline">심정지 골든타임 4분,<br />가장 가까운 AED를 찾아드립니다</h1>
    <p class="stat-line">화성시 전역 <strong>1,077대</strong> AED 실시간 위치 정보 · 공공데이터 기반</p>

    <figure class="mascot">
      <img src="/assets/koriyo_safety.jpg" alt="안전모를 쓴 화성시 캐릭터 코리요와 친구들" />
      <figcaption>출처: 화성시 (공공누리 제1유형)</figcaption>
    </figure>

    <nav class="cards">
      <RouterLink to="/map" class="card">
        <span class="icon">📍</span>
        <span class="label">위치 보기</span>
        <span class="desc">내 주변 AED 위치를 지도에서 확인</span>
      </RouterLink>
      <RouterLink to="/guide" class="card">
        <span class="icon">▶</span>
        <span class="label">사용법</span>
        <span class="desc">AED 사용 영상과 단계별 매뉴얼</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  text-align: center;
}
.brand {
  font-size: 34px;
  font-weight: 800;
  color: var(--text-strong);
  letter-spacing: -0.5px;
  margin: 0 0 24px;
}
.headline {
  font-size: 38px;
  font-weight: 800;
  color: var(--text-strong);
  line-height: 1.28;
  letter-spacing: -0.5px;
  margin: 0 0 16px;
}
.stat-line {
  font-size: 15px;
  color: var(--text-muted);
  margin: 0 0 40px;
}
.stat-line strong {
  color: var(--text);
  font-weight: 700;
}
.mascot {
  margin: 0 0 40px;
}
.mascot img {
  max-width: 280px;
  width: 100%;
  height: auto;
  border-radius: 16px;
  border: 1px solid var(--border);
  display: block;
}
.mascot figcaption {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 8px;
}
.cards {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 220px;
  padding: 32px 24px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s, transform 0.15s;
}
.card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}
.card .icon {
  font-size: 30px;
  margin-bottom: 4px;
}
.card .label {
  font-weight: 700;
  font-size: 17px;
  color: var(--text-strong);
}
.card .desc {
  font-size: 13px;
  color: var(--text-muted);
}

@media (max-width: 480px) {
  .brand {
    font-size: 26px;
  }
  .headline {
    font-size: 28px;
  }
  .mascot img {
    max-width: 220px;
  }
}
</style>
