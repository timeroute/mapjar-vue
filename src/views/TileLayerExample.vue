<template>
  <div class="example-page">
    <h2>Tile Layer Example</h2>
    <div class="map-container">
      <MapjarMap :center="center" :zoom="zoom" @load="onMapLoad" @error="onMapError">
        <TileLayer 
          id="osm-tiles" 
          url-template="https://www.tmsats.com/tile2/api/v1/tile/tdt/img/{z}/{x}/{y}"
          :tile-scale="tileScale" 
        />
      </MapjarMap>
    </div>
    <div class="controls">
      <button @click="zoom++">Zoom In</button>
      <button @click="zoom--">Zoom Out</button>
      <button @click="resetView">Reset View</button>
      <div class="slider-control">
        <label>Tile Scale: {{ tileScale.toFixed(1) }}</label>
        <input v-model.number="tileScale" type="range" min="0.5" max="3" step="0.1" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MapjarMap, TileLayer } from '../../lib/main'
import type { MapEngine } from 'mapjar'

const center = ref<[number, number]>([116.3975, 39.9085])
const zoom = ref(10)
const tileScale = ref(1)

const onMapLoad = (mapEngine: MapEngine) => {
  console.log('Map loaded', mapEngine)
}

const onMapError = (error: Error) => {
  console.error('Map failed to load', error)
}

const resetView = () => {
  center.value = [116.3975, 39.9085]
  zoom.value = 10
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
  flex-wrap: wrap;
}

.slider-control {
  display: flex;
  flex-direction: column;
  gap: 5px;
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
