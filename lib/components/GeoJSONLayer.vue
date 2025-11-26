<script setup lang="ts">
import { inject, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { GeoJSONLayer, type MapEngine, type VectorStyle } from 'mapjar'

const props = withDefaults(defineProps<{
  id: string
  url?: string
  data?: any // GeoJSON.FeatureCollection | GeoJSON.Feature
  style?: VectorStyle
}>(), {
})

const mapEngineRef = inject<Ref<MapEngine | null>>('mapEngine')
let layer: GeoJSONLayer | null = null

const initLayer = () => {
  if (!mapEngineRef?.value) return

  try {
    layer = new GeoJSONLayer(props.id, {
      url: props.url,
      data: props.data,
      style: props.style
    })

    const camera = mapEngineRef.value.getCamera()
    layer.setCamera(camera)
    mapEngineRef.value.addLayer(layer)
    
    if (props.url) {
        layer.loadFromURL().catch(err => console.error(`Failed to load GeoJSON from ${props.url}`, err))
    }

    console.log(`GeoJSONLayer ${props.id} initialized`)
  } catch (error) {
    console.error('Failed to create GeoJSONLayer:', error)
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
      console.error('Failed to remove GeoJSONLayer:', error)
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

watch(() => props.data, (newData) => {
  if (layer && newData) {
    layer.setGeoJSON(newData)
  }
}, { deep: true })

watch(() => props.url, (newUrl) => {
    // Re-creating layer or implementing setUrl if supported would be better, 
    // but GeoJSONLayer usually loads on init. 
    // For now, if URL changes, we might need to reload. 
    // Checking mapjar API, loadFromURL is async.
    // However, the constructor takes the URL. 
    // Let's assume for now we might need to manually handle this or just recreate.
    // But to keep it simple and consistent with other layers:
    if (layer && newUrl) {
       // There isn't a setUrl method in the d.ts I saw, but there is loadFromURL.
       // It seems it uses the internal URL. 
       // If the API doesn't support changing URL easily, we might just warn or do nothing.
       // Actually, looking at d.ts: constructor(id: string, options?: GeoJSONLayerOptions); loadFromURL(): Promise<void>;
       // It doesn't seem to expose a way to change URL after init easily without hacking.
       // So we'll skip watching URL for now or just log a warning that it requires remount.
       console.warn('GeoJSONLayer: Changing URL dynamically is not fully supported yet.')
    }
})

defineExpose({
  getLayer: () => layer
})
</script>

<template>
  <slot />
</template>
