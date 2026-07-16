<script setup>
import { onMounted, ref } from 'vue'
import { useA11yStore } from '../stores/a11y'

const store = useA11yStore()
const open = ref(false)
const reading = ref(false)

const FONT_LABEL = { 1: '기본', 1.2: '크게', 1.4: '아주 크게' }

function getReadableText() {
  const appEl = document.getElementById('app')
  if (!appEl) return ''
  const clone = appEl.cloneNode(true)
  clone.querySelectorAll('.list, .a11y-wrap, .map, .map-wrap').forEach((el) => el.remove())
  return clone.textContent.replace(/\s+/g, ' ').trim()
}

function toggleReadPage() {
  if (!window.speechSynthesis) return
  if (reading.value) {
    window.speechSynthesis.cancel()
    reading.value = false
    return
  }
  const text = getReadableText()
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'ko-KR'
  utter.onend = () => {
    reading.value = false
  }
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utter)
  reading.value = true
}

onMounted(() => {
  store.apply()
})
</script>

<template>
  <div class="a11y-wrap">
    <div v-if="open" class="a11y-panel">
      <button @click="store.toggleHighContrast">
        {{ store.highContrast ? '☀ 고대비 끄기' : '◐ 고대비 화면' }}
      </button>
      <button @click="store.cycleFontScale">
        🔍 글자 크기: {{ FONT_LABEL[store.fontScale] }}
      </button>
      <button @click="toggleReadPage">
        {{ reading ? '⏹ 읽기 중지' : '🔊 화면 읽어주기' }}
      </button>
    </div>
    <button class="a11y-toggle" aria-label="접근성 설정" @click="open = !open">♿</button>
  </div>
</template>

<style scoped>
.a11y-wrap {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}
.a11y-toggle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--bg);
  border: none;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}
.a11y-panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 170px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}
.a11y-panel button {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  text-align: left;
}
.a11y-panel button:hover {
  border-color: var(--accent);
}
</style>
