import { defineStore } from 'pinia'

const STORAGE_KEY = 'aed-a11y-settings'
const FONT_SCALES = [1, 1.2, 1.4]

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

export const useA11yStore = defineStore('a11y', {
  state: () => {
    const saved = loadSaved()
    return {
      highContrast: saved.highContrast || false,
      fontScale: FONT_SCALES.includes(saved.fontScale) ? saved.fontScale : 1,
    }
  },
  actions: {
    toggleHighContrast() {
      this.highContrast = !this.highContrast
      this.persist()
      this.apply()
    },
    cycleFontScale() {
      const idx = FONT_SCALES.indexOf(this.fontScale)
      this.fontScale = FONT_SCALES[(idx + 1) % FONT_SCALES.length]
      this.persist()
      this.apply()
    },
    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ highContrast: this.highContrast, fontScale: this.fontScale }),
      )
    },
    apply() {
      document.documentElement.classList.toggle('a11y-high-contrast', this.highContrast)
      const appEl = document.getElementById('app')
      if (appEl) appEl.style.zoom = String(this.fontScale)
    },
  },
})
