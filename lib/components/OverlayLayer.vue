<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, provide, watch, type Ref } from 'vue'
import { OverlayLayer, type MapEngine } from 'mapjar'

const props = defineProps<{
  id: string
}>()

const mapEngineRef = inject<Ref<MapEngine | null>>('mapEngine')
const containerRef = ref<HTMLElement>()
const layerRef = ref<OverlayLayer | null>(null)

// Provide the layer instance to child MapOverlay components
provide('overlayLayer', layerRef)

const initLayer = () => {
  if (!mapEngineRef?.value || !containerRef.value) return

  try {
    const layer = new OverlayLayer(props.id)
    layer.initContainer(containerRef.value)
    
    const camera = mapEngineRef.value.getCamera()
    layer.setCamera(camera)
    
    // Set DPR if needed, though usually MapEngine handles it or Layer gets it from camera/context?
    // OverlayLayer has setDevicePixelRatio.
    layer.setDevicePixelRatio(window.devicePixelRatio || 1)

    mapEngineRef.value.addLayer(layer)
    layerRef.value = layer

    console.log(`OverlayLayer ${props.id} initialized`)
  } catch (error) {
    console.error('Failed to create OverlayLayer:', error)
  }
}

onMounted(() => {
  // Wait for mapEngine to be available
  if (mapEngineRef?.value) {
    initLayer()
  } else {
    const stopWatch = (watch as any)(
      () => mapEngineRef?.value,
      (engine: MapEngine | null) => {
        if (engine) {
          initLayer()
          stopWatch()
        }
      }
    )
  }
})

onUnmounted(() => {
  if (layerRef.value && mapEngineRef?.value) {
    try {
      mapEngineRef.value.removeLayer(props.id)
    } catch (error) {
      console.error('Failed to remove OverlayLayer:', error)
    }
  }
  layerRef.value = null
})

defineExpose({
  getLayer: () => layerRef.value
})
</script>

<template>
  <div class="mapjar-overlay-layer" ref="containerRef">
    <slot />
  </div>
</template>

<style scoped>
.mapjar-overlay-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Let clicks pass through to map */
  overflow: hidden;
}
/* Children (overlays) should enable pointer-events if they need interaction */
:deep(.mapjar-overlay) {
  pointer-events: auto;
}
</style>
