<template>
  <div class="mapjar-map-wrapper">
    <canvas ref="mapCanvas" class="mapjar-map"></canvas>
    <slot v-if="mapEngineRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, provide, nextTick } from 'vue'
import { MapEngine } from 'mapjar'
import type { MapjarMapProps, MapjarMapEmits } from '../types'

const props = withDefaults(defineProps<MapjarMapProps>(), {
  center: () => [120, 30],
  zoom: 10
})

const emit = defineEmits<MapjarMapEmits>()

const mapCanvas = ref<HTMLCanvasElement>()
const mapEngineRef = ref<MapEngine | null>(null)

// 向子组件提供 mapEngine
provide('mapEngine', mapEngineRef)

onMounted(async () => {
  if (!mapCanvas.value) return

  try {
    const engine = new MapEngine(mapCanvas.value, {
      center: props.center,
      zoom: props.zoom
    })

    mapEngineRef.value = engine

    // 等待 DOM 更新后再触发 load 事件，确保子组件可以访问 mapEngine
    await nextTick()
    emit('load', engine)
  } catch (error) {
    emit('error', error as Error)
  }
})

onUnmounted(() => {
  mapEngineRef.value?.stop()
  mapEngineRef.value = null
})

watch(() => props.center, (newCenter) => {
  if (mapEngineRef.value) {
    const camera = mapEngineRef.value.getCamera()
    camera.setCenter(newCenter as any)
  }
})

watch(() => props.zoom, (newZoom) => {
  if (mapEngineRef.value) {
    const camera = mapEngineRef.value.getCamera()
    camera.setZoom(newZoom)
  }
})

defineExpose({
  getMapEngine: () => mapEngineRef.value
})
</script>

<style scoped>
.mapjar-map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.mapjar-map {
  width: 100%;
  height: 100%;
}
</style>
