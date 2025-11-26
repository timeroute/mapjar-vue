<script setup lang="ts">
import { inject, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { ImageLayer, type MapEngine } from 'mapjar'

const props = withDefaults(defineProps<{
  id: string
  url?: string
  image?: HTMLImageElement | ImageBitmap
  bounds: {
    minLon: number
    minLat: number
    maxLon: number
    maxLat: number
  }
  useMipmap?: boolean
}>(), {
  useMipmap: true
})

const mapEngineRef = inject<Ref<MapEngine | null>>('mapEngine')
let layer: ImageLayer | null = null

const initLayer = () => {
  if (!mapEngineRef?.value) return

  try {
    layer = new ImageLayer(props.id, {
      url: props.url,
      image: props.image,
      bounds: props.bounds,
      useMipmap: props.useMipmap
    })

    // ImageLayer extends RasterLayer which extends Layer, so it should have setCamera if it needs it, 
    // but RasterLayer usually just needs render call. 
    // However, looking at d.ts, RasterLayer doesn't explicitly show setCamera but Layer doesn't either in the abstract.
    // Wait, TileLayer had setCamera. Let's check d.ts again.
    // Abstract Layer has abstract render and destroy.
    // TileLayer has setCamera.
    // VectorLayer has setCamera.
    // WindLayer has setCamera.
    // HeatmapLayer has setCamera.
    // OverlayLayer has setCamera.
    // ImageLayer extends RasterLayer. 
    // Does RasterLayer have setCamera? 
    // The d.ts for RasterLayer: protected initWebGL, createTexture, renderRect, destroyBase.
    // It does NOT show setCamera.
    // But ImageLayer might need it? 
    // Actually, RasterLayer usually renders a quad. It might use the viewMatrix passed to render().
    // Let's assume it doesn't need explicit setCamera unless the d.ts says so.
    // Checking d.ts for ImageLayer: constructor, loadFromURL, setImage. No setCamera.
    // So we don't call setCamera for ImageLayer.
    
    mapEngineRef.value.addLayer(layer)
    
    if (props.url && !props.image) {
        layer.loadFromURL().catch(err => console.error(`Failed to load Image from ${props.url}`, err))
    }

    console.log(`ImageLayer ${props.id} initialized`)
  } catch (error) {
    console.error('Failed to create ImageLayer:', error)
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
      console.error('Failed to remove ImageLayer:', error)
    }
  }
  layer = null
  stopWatch()
})

watch(() => props.image, (newImage) => {
  if (layer && newImage) {
    layer.setImage(newImage)
  }
})

defineExpose({
  getLayer: () => layer
})
</script>

<template>
  <slot />
</template>
