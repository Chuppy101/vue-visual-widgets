<script setup>
import { computed, reactive, ref } from 'vue'
import PieChart from '../components/PieChart.vue'
import ColorPickerField from '../components/ColorPickerField.vue'

let nextId = 4

const items = ref([
  { id: 1, name: 'Product', value: 45, color: '#1677ff' },
  { id: 2, name: 'Marketing', value: 30, color: '#52c41a' },
  { id: 3, name: 'Support', value: 25, color: '#faad14' },
])

const form = reactive({
  name: '',
  value: '',
  color: '#1677ff',
})

const editingId = ref(null)
const error = ref('')

const total = computed(() => items.value.reduce((sum, x) => sum + (Number(x.value) || 0), 0))

const canSubmit = computed(() => {
  const nameOk = String(form.name || '').trim().length > 0
  const v = Number(form.value)
  const valueOk = Number.isFinite(v) && v > 0
  const colorOk = typeof form.color === 'string' && form.color.length > 0
  return nameOk && valueOk && colorOk
})

function resetForm() {
  form.name = ''
  form.value = ''
  form.color = '#1677ff'
  editingId.value = null
  error.value = ''
}

function submit() {
  error.value = ''

  if (!canSubmit.value) {
    error.value = 'Заполни корректно: наименование, значение (> 0) и цвет.'
    return
  }

  const payload = {
    name: String(form.name).trim(),
    value: Number(form.value),
    color: form.color,
  }

  if (editingId.value != null) {
    const idx = items.value.findIndex((x) => x.id === editingId.value)
    if (idx >= 0) items.value[idx] = { ...items.value[idx], ...payload }
    resetForm()
    return
  }

  items.value = [...items.value, { id: nextId++, ...payload }]
  resetForm()
}

function startEdit(id) {
  const item = items.value.find((x) => x.id === id)
  if (!item) return

  editingId.value = id
  form.name = item.name
  form.value = String(item.value)
  form.color = item.color
  error.value = ''
}

function removeItem(id) {
  items.value = items.value.filter((x) => x.id !== id)
  if (editingId.value === id) resetForm()
}
</script>

<template>
  <div class="grid" style="gap: 14px">
    <section class="card">
      <div class="card__header">
        <h2 class="card__title">Task 2 - Pie chart + CRUD form</h2>
        <p class="card__subtitle">
          Chart.js pie chart. Добавление, редактирование и удаление сегментов. Цвет выбирается через color picker
          из сторонней библиотеки.
        </p>
      </div>
      <div class="card__content">
        <div class="grid grid--2">
          <div class="card inner">
            <div class="inner__head">
              <div class="inner__title">Preview</div>
              <div class="inner__meta">Total: <span class="mono">{{ total }}</span></div>
            </div>
            <div class="inner__body">
              <PieChart :items="items" title="" />
            </div>
          </div>

          <div class="card inner">
            <div class="inner__head">
              <div class="inner__title">Form</div>
              <div class="inner__meta" v-if="editingId != null">Editing id: <span class="mono">{{ editingId }}</span></div>
            </div>
            <div class="inner__body">
              <div class="grid" style="gap: 12px">
                <div class="field">
                  <div class="label">Наименование</div>
                  <input class="input" v-model="form.name" placeholder="Например: Sales" />
                </div>

                <div class="field">
                  <div class="label">Значение</div>
                  <input class="input" v-model="form.value" inputmode="decimal" placeholder="Например: 25" />
                </div>

                <div class="field">
                  <div class="label">Цвет</div>
                  <ColorPickerField v-model="form.color" />
                </div>

                <div v-if="error" class="error">{{ error }}</div>

                <div class="row">
                  <button class="btn btn--primary" type="button" :disabled="!canSubmit" @click="submit">
                    {{ editingId != null ? 'Сохранить' : 'Добавить' }}
                  </button>
                  <button class="btn" type="button" @click="resetForm">Сбросить</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="spacer" />

        <div class="card inner">
          <div class="inner__head">
            <div class="inner__title">Items</div>
            <div class="inner__meta">{{ items.length }} pcs</div>
          </div>
          <div class="inner__body">
            <div class="list" role="list">
              <div v-for="x in items" :key="x.id" class="item" role="listitem">
                <div class="item__left">
                  <span class="dot" :style="{ background: x.color }" />
                  <div class="item__text">
                    <div class="item__name">{{ x.name }}</div>
                    <div class="item__sub">
                      value: <span class="mono">{{ x.value }}</span> · color: <span class="mono">{{ x.color }}</span>
                    </div>
                  </div>
                </div>

                <div class="item__actions">
                  <button class="btn" type="button" @click="startEdit(x.id)">Edit</button>
                  <button class="btn btn--danger" type="button" @click="removeItem(x.id)">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.inner {
  padding: 0;
  box-shadow: none;
}

.inner__head {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.inner__title {
  font-weight: 700;
}

.inner__meta {
  font-size: 12px;
  color: var(--muted);
}

.inner__body {
  padding: 12px 14px 14px;
}

.error {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 77, 79, 0.35);
  background: rgba(255, 77, 79, 0.08);
  color: #b42318;
  font-size: 13px;
}

.list {
  display: grid;
  gap: 10px;
}

.item {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: rgba(0, 0, 0, 0.01);
}

.item__left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  flex: 0 0 auto;
}

.item__text {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.item__name {
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item__sub {
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item__actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

@media (max-width: 520px) {
  .item {
    flex-direction: column;
    align-items: stretch;
  }

  .item__actions {
    justify-content: stretch;
  }

  .item__actions .btn {
    width: 100%;
  }
}
</style>
