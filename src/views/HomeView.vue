<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="home">
    <h1 class="brand">AED 지도</h1>
    <p class="tagline">가까운 자동심장충격기를 찾고, 사용법까지 한 곳에서</p>

    <nav class="nav-cards">
      <RouterLink to="/map" class="nav-card">
        <span class="icon">📍</span>
        <span class="label">위치 보기</span>
        <span class="desc">내 주변 AED 위치를 지도에서 확인</span>
      </RouterLink>
      <RouterLink to="/guide" class="nav-card">
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
  padding: 24px;
  text-align: center;
}
.brand {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px;
}
.tagline {
  font-size: 14px;
  color: #666;
  margin: 0 0 32px;
}
.nav-cards {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}
.nav-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 200px;
  padding: 28px 20px;
  border: 1px solid #e0e0e0;
  border-radius: 14px;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.15s, border-color 0.15s;
}
.nav-card:hover {
  border-color: #1a5fb4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.nav-card .icon {
  font-size: 28px;
  margin-bottom: 4px;
}
.nav-card .label {
  font-weight: 600;
  font-size: 16px;
}
.nav-card .desc {
  font-size: 12px;
  color: #777;
}
</style>
