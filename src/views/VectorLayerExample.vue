<template>
  <div class="example-page">
    <h2>Vector Layer Example</h2>
    <div class="map-container">
      <MapjarMap :center="center" :zoom="zoom" @load="onMapLoad">
        <TileLayer 
          id="base-tiles" 
          url-template="https://www.tmsats.com/tile2/api/v1/tile/tdt/img/{z}/{x}/{y}" 
        />
        
        <VectorLayer 
          id="vector-layer" 
          :style="vectorStyle" 
          ref="vectorLayerRef" 
        />
      </MapjarMap>
    </div>
    <div class="controls">
      <button @click="addRandomPoint">Add Random Point</button>
      <button @click="clearFeatures">Clear Features</button>
      <label>
        <input type="checkbox" v-model="showPolygon" @change="togglePolygon"> Show Polygon
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MapjarMap, TileLayer, VectorLayer } from '../../lib/main'
import type { MapEngine, VectorStyle } from 'mapjar'

const center = ref<[number, number]>([116.3975, 39.9085])
const zoom = ref(10)
const vectorLayerRef = ref()
const showPolygon = ref(false)

const vectorStyle = ref<VectorStyle>({
  fillColor: [1, 0, 0, 0.5],
  strokeColor: [1, 1, 1, 1],
  strokeWidth: 2,
  pointSize: 10
})

const onMapLoad = (mapEngine: MapEngine) => {
  console.log('Map loaded', mapEngine)
}

const addRandomPoint = () => {
  if (!vectorLayerRef.value) return
  
  const lon = 116.3975 + (Math.random() - 0.5) * 0.5
  const lat = 39.9085 + (Math.random() - 0.5) * 0.5
  
  vectorLayerRef.value.addFeature({
    type: 'point',
    coordinates: [lon, lat],
    properties: { id: Date.now() }
  })
}

const clearFeatures = () => {
  vectorLayerRef.value?.clearFeatures()
  showPolygon.value = false
}

const togglePolygon = () => {
  if (!vectorLayerRef.value) return
  
  if (showPolygon.value) {
    vectorLayerRef.value.addFeature({
      type: 'polygon',
      coordinates: [[
        [116.3, 39.8],
        [116.5, 39.8],
        [116.5, 40.0],
        [116.3, 40.0],
        [116.3, 39.8]
      ]],
      properties: { name: 'Box' }
    })
  } else {
    // Ideally we would remove specific feature, but for simplicity here we clear and re-add points if we tracked them
    // Or just clear all for this demo if user untoggles
    // Since VectorLayer wrapper doesn't expose removeFeature by ID easily yet (it wraps mapjar), 
    // we'll just clear all and warn user or just let it be additive for now.
    // Actually, let's just re-init or keep it simple.
    console.log('Toggle off not fully implemented in demo, clear to reset')
  }
}
</script>

<style scoped>
.example-page {
  padding: 20px;
}

.map-container {
  width: 100%;
  height: 600px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #646cff;
  background: #646cff;
  color: white;
  cursor: pointer;
}
</style>
