<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { to: '/progress', label: 'Task 1 - Circular Progress' },
  { to: '/pie', label: 'Task 2 - Pie Chart' },
]

const activePath = computed(() => route.path)
</script>

<template>
  <div class="app">
    <header class="topbar">
      <div class="topbar__inner">
        <div class="brand">
          <div class="brand__title">Vue 3 Test Task</div>
          <div class="brand__subtitle">Composition API - SVG progress + Chart.js pie</div>
        </div>

        <nav class="tabs" aria-label="Navigation">
          <RouterLink
            v-for="t in tabs"
            :key="t.to"
            :to="t.to"
            class="tab"
            :class="{ 'tab--active': activePath.startsWith(t.to) }"
          >
            {{ t.label }}
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="content">
      <RouterView />
    </main>

    <footer class="footer">
      <div class="footer__inner">
        <span>Test task demo</span>
      </div>
    </footer>
  </div>
</template>
