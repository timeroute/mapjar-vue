<template>
  <div class="example-page">
    <h2>Other Layers Example</h2>
    <div class="map-container">
      <MapjarMap :center="center" :zoom="zoom">
        <TileLayer 
          id="base-tiles" 
          url-template="https://www.tmsats.com/tile2/api/v1/tile/tdt/img/{z}/{x}/{y}" 
        />
        
        <ImageLayer
          v-if="showImage"
          id="image-layer"
          url="https://mapjar.org/images/logo.png"
          :bounds="{ minLon: 116.3, minLat: 39.8, maxLon: 116.5, maxLat: 40.0 }"
        />

        <HeatmapLayer
          v-if="showHeatmap"
          id="heatmap-layer"
          :data="heatmapData"
          :options="{ colorRamp: ['rgba(0,0,255,0)', 'rgba(0,255,0,0.5)', 'rgba(255,0,0,0.8)'] }"
        />
      </MapjarMap>
    </div>
    <div class="controls">
      <label>
        <input type="checkbox" v-model="showImage"> Show Image Layer
      </label>
      <label>
        <input type="checkbox" v-model="showHeatmap"> Show Heatmap Layer
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MapjarMap, TileLayer, ImageLayer, HeatmapLayer } from '../../lib/main'

const center = ref<[number, number]>([116.4, 39.9])
const zoom = ref(10)
const showImage = ref(true)
const showHeatmap = ref(false)

// Mock heatmap data
const heatmapData = {
  width: 256,
  height: 256,
  values: new Float32Array(256 * 256).map(() => Math.random()),
  bounds: { minLon: 116.3, minLat: 39.8, maxLon: 116.5, maxLat: 40.0 }
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
  gap: 20px;
}
</style>
