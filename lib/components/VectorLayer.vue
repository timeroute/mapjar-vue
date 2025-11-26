<script setup lang="ts">
import { inject, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { VectorLayer, type MapEngine, type VectorStyle, type Feature, type DataDrivenStyle } from 'mapjar'

const props = withDefaults(defineProps<{
  id: string
  style?: VectorStyle
  dataDrivenStyle?: DataDrivenStyle
}>(), {
})

const mapEngineRef = inject<Ref<MapEngine | null>>('mapEngine')
let layer: VectorLayer | null = null

const initLayer = () => {
  if (!mapEngineRef?.value) return

  try {
    layer = new VectorLayer(props.id, props.style)
    if (props.dataDrivenStyle) {
      layer.setDataDrivenStyle(props.dataDrivenStyle)
    }

    const camera = mapEngineRef.value.getCamera()
    layer.setCamera(camera)
    mapEngineRef.value.addLayer(layer)

    console.log(`VectorLayer ${props.id} initialized`)
  } catch (error) {
    console.error('Failed to create VectorLayer:', error)
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
      console.error('Failed to remove VectorLayer:', error)
    }
  }
  layer = null
  stopWatch()
})

watch(() => props.style, (newStyle) => {
  if (layer && newStyle) {
    layer.setStyle(newStyle)
  }
}, { deep: true })

watch(() => props.dataDrivenStyle, (newStyle) => {
  if (layer && newStyle) {
    layer.setDataDrivenStyle(newStyle)
  }
}, { deep: true })

defineExpose({
  getLayer: () => layer,
  addFeature: (feature: Feature) => layer?.addFeature(feature),
  addFeatures: (features: Feature[]) => layer?.addFeatures(features),
  clearFeatures: () => layer?.clearFeatures(),
  getFeatures: () => layer?.getFeatures()
})
</script>

<template>
  <slot />
</template>
