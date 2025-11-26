<template>
  <div class="example-page">
    <h2>GeoJSON Example</h2>
    <div class="map-container">
      <MapjarMap :center="center" :zoom="zoom">
        <TileLayer 
          id="base-tiles" 
          url-template="https://www.tmsats.com/tile2/api/v1/tile/tdt/img/{z}/{x}/{y}" 
        />
        
        <GeoJSONLayer 
          id="geojson-layer" 
          :data="geojsonData"
          :style="{ fillColor: [0, 1, 0, 0.3], strokeColor: [0, 0.5, 0, 1], strokeWidth: 2 }"
        />
      </MapjarMap>
    </div>
    <div class="controls">
      <p>Displaying a simple GeoJSON polygon.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MapjarMap, TileLayer, GeoJSONLayer } from '../../lib/main'

const center = ref<[number, number]>([116.4, 39.9])
const zoom = ref(10)

const geojsonData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [116.3, 39.8],
          [116.5, 39.8],
          [116.5, 40.0],
          [116.3, 40.0],
          [116.3, 39.8]
        ]]
      }
    }
  ]
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
</style>
