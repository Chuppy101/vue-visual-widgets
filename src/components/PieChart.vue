<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: 'Pie chart',
  },
})

const canvasRef = ref(null)
let chart = null

function buildDataset(items) {
  const labels = items.map((x) => x.name)
  const data = items.map((x) => Number(x.value) || 0)
  const backgroundColor = items.map((x) => x.color)

  return { labels, data, backgroundColor }
}

function render() {
  if (!canvasRef.value) return

  const { labels, data, backgroundColor } = buildDataset(props.items)

  if (!chart) {
    chart = new Chart(canvasRef.value, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor,
            borderColor: '#ffffff',
            borderWidth: 2,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
          title: {
            display: !!props.title,
            text: props.title,
            font: { size: 14, weight: '600' },
          },
        },
      },
    })
    return
  }

  chart.data.labels = labels
  chart.data.datasets[0].data = data
  chart.data.datasets[0].backgroundColor = backgroundColor
  chart.update()
}

onMounted(render)

watch(
  () => props.items,
  () => render(),
  { deep: true },
)

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
    chart = null
  }
})
</script>

<template>
  <div class="chart">
    <canvas ref="canvasRef" />
  </div>
</template>

<style scoped>
.chart {
  position: relative;
  width: 100%;
  height: 320px;
}

@media (max-width: 900px) {
  .chart {
    height: 280px;
  }
}
</style>
