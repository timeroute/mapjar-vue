<script setup lang="ts">
import { inject, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { TileLayer, type MapEngine } from 'mapjar'
import type { TileLayerProps } from '../types'

const props = withDefaults(defineProps<TileLayerProps>(), {
  maxConcurrent: 6,
  tileScale: 1,
  wrapX: true,
  fadeInDuration: 300
})

const mapEngineRef = inject<Ref<MapEngine | null>>('mapEngine')
let tileLayer: TileLayer | null = null

const initLayer = () => {
  if (!mapEngineRef?.value) {
    console.warn('TileLayer: MapEngine not available yet.')
    return
  }

  try {
    tileLayer = new TileLayer(props.id, props.urlTemplate, {
      maxConcurrent: props.maxConcurrent,
      tileScale: props.tileScale,
      wrapX: props.wrapX,
      fadeInDuration: props.fadeInDuration
    })

    const camera = mapEngineRef.value.getCamera()
    tileLayer.setCamera(camera)
    mapEngineRef.value.addLayer(tileLayer)

    console.log(`TileLayer ${props.id} initialized`)
  } catch (error) {
    console.error('Failed to create TileLayer:', error)
  }
}

// 监听 mapEngine 的变化，当它可用时初始化图层
const stopWatch = watch(
  () => mapEngineRef?.value,
  (engine) => {
    if (engine && !tileLayer) {
      initLayer()
      stopWatch() // 初始化后停止监听
    }
  }
)

onMounted(() => {
  // 如果 mapEngine 已经可用，立即初始化
  if (mapEngineRef?.value && !tileLayer) {
    initLayer()
  }
})

onUnmounted(() => {
  if (tileLayer && mapEngineRef?.value) {
    try {
      mapEngineRef.value.removeLayer(props.id)
      console.log(`TileLayer ${props.id} removed`)
    } catch (error) {
      console.error('Failed to remove TileLayer:', error)
    }
  }
  tileLayer = null
  stopWatch()
})

watch(
  () => props.tileScale,
  (newScale) => {
    if (tileLayer && newScale >= 0.5 && newScale <= 3.0) {
      tileLayer.setTileScale(newScale)
    }
  }
)

defineExpose({
  getTileLayer: () => tileLayer
})
</script>

<template>
  <slot />
</template>
