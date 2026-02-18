<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, default: 0 },
  status: {
    type: String,
    default: 'in-progress',
    validator: (v) => ['in-progress', 'success', 'warning', 'error'].includes(v),
  },
  type: {
    type: String,
    default: 'circle',
    validator: (v) => ['circle', 'dashboard'].includes(v),
  },
  size: { type: Number, default: 140 },
  strokeWidth: { type: Number, default: 10 },
  trackWidth: { type: Number, default: 10 },
  showText: { type: Boolean, default: true },

  durationMs: { type: Number, default: 500 },
})

function clamp01(n) {
  const x = Number.isFinite(n) ? n : 0
  return Math.min(1, Math.max(0, x))
}

function colorByValue(percent) {
  const t = clamp01(percent / 100)
  const h = t < 0.5 ? lerp(0, 240, t / 0.5) : lerp(240, 120, (t - 0.5) / 0.5)
  return `hsl(${Math.round(h)}, 85%, 52%)`
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

const clampedValue = computed(() => {
  const v = Number.isFinite(props.value) ? props.value : 0
  return Math.max(0, Math.min(100, v))
})

const displayValue = computed(() => (props.status === 'in-progress' ? clampedValue.value : 100))

const center = computed(() => props.size / 2)
const radius = computed(() => (props.size - Math.max(props.strokeWidth, props.trackWidth)) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const isDashboard = computed(() => props.type === 'dashboard')
const arcDegree = computed(() => (isDashboard.value ? 270 : 360))
const arcRatio = computed(() => arcDegree.value / 360)

const rotationDeg = computed(() => (isDashboard.value ? 135 : -90))

const trackDasharray = computed(() => {
  if (!isDashboard.value) return `${circumference.value}`
  return `${circumference.value * arcRatio.value} ${circumference.value}`
})

const progressDasharray = computed(() => {
  if (!isDashboard.value) return `${circumference.value}`
  const len = circumference.value * arcRatio.value * (displayValue.value / 100)
  return `${len} ${circumference.value}`
})

const progressDashoffset = computed(() => {
  if (isDashboard.value) return 0
  return circumference.value * (1 - displayValue.value / 100)
})

const strokeColor = computed(() => {
  if (props.status === 'success') return 'var(--success)'
  if (props.status === 'warning') return 'var(--warning)'
  if (props.status === 'error') return 'var(--error)'
  return colorByValue(displayValue.value)
})

const transitionStyle = computed(() => {
  const d = Math.max(0, props.durationMs)
  return {
    transition: `stroke-dashoffset ${d}ms ease, stroke-dasharray ${d}ms ease, stroke ${d}ms ease`,
  }
})

const text = computed(() => `${Math.round(clampedValue.value)}%`)

const iconStroke = computed(() => {
  if (props.status === 'success') return 'var(--success)'
  if (props.status === 'warning') return 'var(--warning)'
  if (props.status === 'error') return 'var(--error)'
  return 'var(--muted)'
})
</script>

<template>
  <div
    class="cp"
    role="img"
    :aria-label="`progress ${Math.round(clampedValue)}% (${status})`"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="cp__svg">
      <g :transform="`rotate(${rotationDeg} ${center} ${center})`">
        <circle
          class="cp__track"
          :cx="center"
          :cy="center"
          :r="radius"
          :stroke-width="trackWidth"
          :stroke-dasharray="trackDasharray"
        />

        <circle
          class="cp__progress"
          :cx="center"
          :cy="center"
          :r="radius"
          :stroke-width="strokeWidth"
          :stroke="strokeColor"
          :stroke-dasharray="isDashboard ? progressDasharray : circumference"
          :stroke-dashoffset="progressDashoffset"
          :style="transitionStyle"
        />
      </g>

      <g v-if="showText" class="cp__center" :transform="`translate(${center} ${center})`">
        <Transition name="fade" mode="out-in">
          <g :key="status">
            <template v-if="status === 'in-progress'">
              <text class="cp__text" text-anchor="middle" dominant-baseline="middle">{{ text }}</text>
            </template>

            <template v-else-if="status === 'success'">
              <path
                class="cp__icon"
                :stroke="iconStroke"
                d="M -16 2 L -6 12 L 16 -10"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="5"
              />
            </template>

            <template v-else-if="status === 'warning'">
              <path
                class="cp__icon"
                :stroke="iconStroke"
                d="M 0 -16 L 0 6"
                fill="none"
                stroke-linecap="round"
                stroke-width="5"
              />
              <circle :fill="iconStroke" cx="0" cy="15" r="3" />
            </template>

            <template v-else>
              <path
                class="cp__icon"
                :stroke="iconStroke"
                d="M -12 -12 L 12 12 M 12 -12 L -12 12"
                fill="none"
                stroke-linecap="round"
                stroke-width="5"
              />
            </template>
          </g>
        </Transition>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.cp {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.cp__svg {
  overflow: visible;
}

.cp__track {
  fill: none;
  stroke: #edf0f5;
  stroke-linecap: round;
}

.cp__progress {
  fill: none;
  stroke-linecap: round;
  transform-origin: center;
}

.cp__center {
  transform-origin: center;
}

.cp__text {
  font-weight: 650;
  font-size: 28px;
  fill: #6b7280;
}

.cp__icon {
  transition: stroke 300ms ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 180ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
