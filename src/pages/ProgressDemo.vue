<script setup>
import { computed, ref } from 'vue'
import CircularProgress from '../components/CircularProgress.vue'

const value = ref(60)
const status = ref('in-progress')
const type = ref('circle')
const size = ref(160)
const strokeWidth = ref(10)

const statusOptions = [
  { value: 'in-progress', label: 'in progress' },
  { value: 'success', label: 'success' },
  { value: 'warning', label: 'warning' },
  { value: 'error', label: 'error' },
]

const typeOptions = [
  { value: 'circle', label: 'circle' },
  { value: 'dashboard', label: 'dashboard' },
]

const clamped = computed(() => Math.max(0, Math.min(100, Number(value.value) || 0)))
</script>

<template>
  <div class="grid" style="gap: 14px">
    <section class="card">
      <div class="card__header">
        <h2 class="card__title">Task 1 - SVG Circular Progress</h2>
        <p class="card__subtitle">
          4 состояния (in progress, success, warning, error), плавная анимация при смене value и status,
          поддержка режима dashboard.
        </p>
      </div>
      <div class="card__content">
        <div class="examples" aria-label="Examples">
          <div class="ex">
            <CircularProgress :value="0" status="in-progress" :size="120" :stroke-width="9" />
            <div class="ex__cap">0%</div>
          </div>

          <div class="ex">
            <CircularProgress :value="25" status="in-progress" :size="120" :stroke-width="9" />
            <div class="ex__cap">25%</div>
          </div>

          <div class="ex">
            <CircularProgress :value="100" status="success" :size="120" :stroke-width="9" />
            <div class="ex__cap">success</div>
          </div>

          <div class="ex">
            <CircularProgress :value="100" status="warning" :size="120" :stroke-width="9" />
            <div class="ex__cap">warning</div>
          </div>

          <div class="ex">
            <CircularProgress :value="100" status="error" :size="120" :stroke-width="9" />
            <div class="ex__cap">error</div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid grid--2">
      <div class="card">
        <div class="card__header">
          <h3 class="card__title">Playground</h3>
          <p class="card__subtitle">Меняй параметры и смотри плавную анимацию.</p>
        </div>
        <div class="card__content playground">
          <CircularProgress
            :value="clamped"
            :status="status"
            :type="type"
            :size="size"
            :stroke-width="strokeWidth"
            :track-width="strokeWidth"
            :duration-ms="600"
          />

          <div class="playground__meta">
            <div class="meta__line">
              <span class="meta__k">value</span>
              <span class="meta__v mono">{{ clamped }}%</span>
            </div>
            <div class="meta__line">
              <span class="meta__k">status</span>
              <span class="meta__v mono">{{ status }}</span>
            </div>
            <div class="meta__line">
              <span class="meta__k">type</span>
              <span class="meta__v mono">{{ type }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card__header">
          <h3 class="card__title">Controls</h3>
          <p class="card__subtitle">Для быстрого теста поведения компонента.</p>
        </div>
        <div class="card__content">
          <div class="grid" style="gap: 10px">
            <div class="field">
              <div class="label">Value (0..100)</div>
              <div class="row" style="align-items: center">
                <input
                  class="input"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  v-model="value"
                  :style="{ '--range-fill': clamped + '%', flex: 1, minWidth: '160px' }"
                />
                <input class="input" style="width: 96px" type="number" min="0" max="100" step="1" v-model="value" />
              </div>
            </div>

            <div class="field">
              <div class="label">Status</div>
              <select class="select" v-model="status">
                <option v-for="o in statusOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>
            </div>

            <div class="field">
              <div class="label">Type</div>
              <select class="select" v-model="type">
                <option v-for="o in typeOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>
            </div>

            <div class="row">
              <div class="field" style="flex: 1">
                <div class="label">Size</div>
                <input class="input" type="number" min="96" max="320" step="4" v-model="size" />
              </div>
              <div class="field" style="flex: 1">
                <div class="label">Stroke width</div>
                <input class="input" type="number" min="6" max="20" step="1" v-model="strokeWidth" />
              </div>
            </div>

            <div class="row">
              <button class="btn btn--primary" type="button" @click="value = 10">Set 10%</button>
              <button class="btn btn--primary" type="button" @click="value = 60">Set 60%</button>
              <button class="btn" type="button" @click="value = 100">Set 100%</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="card__header">
        <h3 class="card__title">Dashboard examples</h3>
        <p class="card__subtitle">Режим dashboard меняет форму на дугу.</p>
      </div>
      <div class="card__content">
        <div class="examples" style="justify-content: center">
          <CircularProgress type="dashboard" :value="10" status="in-progress" :size="160" :stroke-width="10" />
          <CircularProgress type="dashboard" :value="60" status="in-progress" :size="160" :stroke-width="10" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.examples {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}

.ex {
  display: grid;
  justify-items: center;
  gap: 8px;
}

.ex__cap {
  font-size: 11px;
  color: var(--muted);
}

.playground {
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  gap: 10px;
}

.playground__meta {
  width: 100%;
  max-width: 300px;
  display: grid;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px dashed var(--border);
  background: rgba(0, 0, 0, 0.015);
}

.meta__line {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.meta__k {
  color: var(--muted);
  font-size: 11px;
}

.meta__v {
  font-size: 11px;
}
</style>
