<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ChromePicker } from 'vue-color'

const model = defineModel({ type: String, default: '#1677ff' })

const isOpen = ref(false)
const rootRef = ref(null)

const safeColor = computed(() => (typeof model.value === 'string' && model.value ? model.value : '#1677ff'))

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

function onDocClick(e) {
  const el = rootRef.value
  if (!el) return
  if (!el.contains(e.target)) close()
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div ref="rootRef" class="cpicker">
    <button class="cpicker__btn" type="button" @click.stop="toggle">
      <span class="cpicker__swatch" :style="{ background: safeColor }" />
      <span class="cpicker__value mono">{{ safeColor }}</span>
      <span class="cpicker__chev" aria-hidden="true">▾</span>
    </button>

    <div v-if="isOpen" class="cpicker__popover" @click.stop>
      <ChromePicker v-model="model" />
    </div>
  </div>
</template>

<style scoped>
.cpicker {
  position: relative;
}

.cpicker__btn {
  width: 100%;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #fff;
  cursor: pointer;
}

.cpicker__swatch {
  width: 16px;
  height: 16px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.cpicker__value {
  flex: 1;
  text-align: left;
  font-size: 12px;
}

.cpicker__chev {
  opacity: 0.7;
  font-size: 12px;
}

.cpicker__popover {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  z-index: 20;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #fff;
  box-shadow: var(--shadow);
}
</style>
