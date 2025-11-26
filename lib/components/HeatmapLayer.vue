<script setup lang="ts">
import { inject, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { HeatmapLayer, type MapEngine, type HeatmapData, type HeatmapLayerOptions } from 'mapjar'

const props = withDefaults(defineProps<{
  id: string
  data?: HeatmapData
  options?: HeatmapLayerOptions
}>(), {
})

const mapEngineRef = inject<Ref<MapEngine | null>>('mapEngine')
let layer: HeatmapLayer | null = null

const initLayer = () => {
  if (!mapEngineRef?.value) return

  try {
    layer = new HeatmapLayer(props.id, props.options)
    
    if (props.data) {
        layer.setData(props.data)
    }

    const camera = mapEngineRef.value.getCamera()
    layer.setCamera(camera)
    mapEngineRef.value.addLayer(layer)

    console.log(`HeatmapLayer ${props.id} initialized`)
  } catch (error) {
    console.error('Failed to create HeatmapLayer:', error)
  }
}

const stopWatch = watch(
  () => mapEngineRef?.value,
  (engine) => {
    if (engine && !layer) {
      initLayer()
      stopWatch()
    }
  }
)

onMounted(() => {
  if (mapEngineRef?.value && !layer) {
    initLayer()
  }
})

onUnmounted(() => {
  if (layer && mapEngineRef?.value) {
    try {
      mapEngineRef.value.removeLayer(props.id)
    } catch (error) {
      console.error('Failed to remove HeatmapLayer:', error)
    }
  }
  layer = null
  stopWatch()
})

watch(() => props.data, (newData) => {
  if (layer && newData) {
    layer.setData(newData)
  }
}, { deep: true })

watch(() => props.options?.colorRamp, (newColorRamp) => {
    if (layer && newColorRamp) {
        layer.setColorRamp(newColorRamp)
    }
})

watch(() => props.options?.wrapX, (newWrapX) => {
    if (layer && newWrapX !== undefined) {
        layer.setWrapX(newWrapX)
    }
})

defineExpose({
  getLayer: () => layer
})
</script>

<template>
  <slot />
</template>
