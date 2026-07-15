<script setup>
import { RouterLink } from 'vue-router'

const steps = [
  '전원 켜기 — AED를 켜고 심폐소생술에 방해되지 않는 위치에 둔다',
  '가슴 노출 — 상의를 벗기고 땀·물기를 제거한다',
  '패드 부착 — 패드1: 오른쪽 쇄골 아래 / 패드2: 왼쪽 젖꼭지 아래 겨드랑이선',
  '분석 중 — "분석 중" 음성이 나오면 심폐소생술을 멈추고 환자에게서 손을 뗀다',
  '제세동 시행 — 안내에 따라 충격 버튼을 누른다 (주변 접촉자 없는지 확인)',
  '심폐소생술 재개 — 충격 직후 즉시 재개, 2분마다 반복 분석',
  '구급대 도착까지 반복한다',
]
</script>

<template>
  <div class="page">
    <header class="topbar">
      <RouterLink to="/" class="back">← 지도로</RouterLink>
      <span class="title">AED 사용법</span>
    </header>

    <div class="content">
      <div class="video-wrap">
        <iframe
          src="https://www.youtube.com/embed/b4XAPbxcEZk"
          title="자동심장충격기(AED) 사용법 - 질병관리청 아프지마TV"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        <p class="source">출처: 질병관리청 공식 채널 &quot;아프지마TV&quot;</p>
      </div>

      <ol class="steps">
        <li v-for="(step, i) in steps" :key="i">{{ step }}</li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
}
.topbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e5e5;
}
.back {
  font-size: 14px;
  color: #1a5fb4;
  text-decoration: none;
}
.title {
  font-weight: 600;
  font-size: 16px;
}
.content {
  padding: 16px;
  max-width: 640px;
  margin: 0 auto;
}
.video-wrap {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  margin-bottom: 8px;
}
.video-wrap iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
.source {
  font-size: 12px;
  color: #999;
  margin: 4px 0 20px;
}
.steps {
  padding-left: 20px;
  line-height: 1.8;
  font-size: 14px;
}
</style>
