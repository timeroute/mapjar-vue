<script setup lang="ts">
import { inject, onUnmounted, ref, watch, type Ref } from 'vue'
import type { OverlayLayer } from 'mapjar'

const props = withDefaults(defineProps<{
  id: string
  position: [number, number] // lon, lat
  offset?: [number, number]
  anchor?: [number, number] // e.g. [0.5, 1] for bottom center
  visible?: boolean
}>(), {
  visible: true
})

const overlayLayerRef = inject<Ref<OverlayLayer | null>>('overlayLayer')
const elementRef = ref<HTMLElement>()

const addOverlay = () => {
  const layer = overlayLayerRef?.value
  if (!layer || !elementRef.value) return

  try {
    layer.addOverlay({
      id: props.id,
      element: elementRef.value,
      position: {
        lon: props.position[0],
        lat: props.position[1],
        offset: props.offset,
        anchor: props.anchor
      },
      visible: props.visible
    })
  } catch (error) {
    console.error(`Failed to add overlay ${props.id}:`, error)
  }
}

const updatePosition = () => {
  const layer = overlayLayerRef?.value
  if (!layer) return

  layer.updateOverlayPosition({
      id: props.id,
      element: elementRef.value!, // element is required in interface but updateOverlayPosition might just need id + pos? 
      // Checking d.ts: updateOverlayPosition(overlay: Overlay, position?: OverlayPosition): void;
      // It takes the Overlay object. 
      // So we need to construct the overlay object again or get it.
      // But we can just pass the object with updated values.
      position: {
        lon: props.position[0],
        lat: props.position[1],
        offset: props.offset,
        anchor: props.anchor
      }
  } as any) // Type assertion might be needed if strict
}

watch(
  () => overlayLayerRef?.value,
  (layer) => {
    if (layer) {
      addOverlay()
    }
  },
  { immediate: true }
)

watch(() => props.position, updatePosition, { deep: true })
watch(() => props.offset, updatePosition, { deep: true })
watch(() => props.anchor, updatePosition, { deep: true })

watch(() => props.visible, (visible) => {
  overlayLayerRef?.value?.setOverlayVisible(props.id, visible)
})

onUnmounted(() => {
  overlayLayerRef?.value?.removeOverlay(props.id)
})
</script>

<template>
  <div ref="elementRef" class="mapjar-overlay">
    <slot />
  </div>
</template>

<style scoped>
.mapjar-overlay {
  position: absolute;
  /* Initial position off-screen or handled by OverlayLayer */
  will-change: transform;
}
</style>
