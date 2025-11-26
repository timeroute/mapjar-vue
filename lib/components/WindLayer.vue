<script setup lang="ts">
import { inject, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { WindLayer, type MapEngine, type WindData, type WindLayerOptions } from 'mapjar'

const props = withDefaults(defineProps<{
  id: string
  data?: WindData
  options?: WindLayerOptions
}>(), {
})

const mapEngineRef = inject<Ref<MapEngine | null>>('mapEngine')
let layer: WindLayer | null = null

const initLayer = () => {
  if (!mapEngineRef?.value) return

  try {
    layer = new WindLayer(props.id, props.options)
    
    if (props.data) {
        layer.setData(props.data)
    }

    const camera = mapEngineRef.value.getCamera()
    layer.setCamera(camera)
    mapEngineRef.value.addLayer(layer)

    console.log(`WindLayer ${props.id} initialized`)
  } catch (error) {
    console.error('Failed to create WindLayer:', error)
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
      console.error('Failed to remove WindLayer:', error)
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
