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
      <RouterLink to="/" class="back">← 홈</RouterLink>
      <span class="title">AED 사용법</span>
      <span class="spacer"></span>
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
  font-weight: 800;
  font-size: 18px;
  color: var(--text-strong);
}
.spacer {
  justify-self: end;
}
.content {
  padding: 24px 16px;
  max-width: 640px;
  margin: 0 auto;
}
.video-wrap {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  margin-bottom: 8px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
}
.video-wrap iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.source {
  font-size: 12px;
  color: var(--text-muted);
  margin: 10px 0 24px;
}
.steps {
  padding: 20px 20px 20px 40px;
  line-height: 1.9;
  font-size: 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
}
.steps li::marker {
  color: var(--accent);
  font-weight: 700;
}
</style>
