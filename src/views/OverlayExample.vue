<template>
  <div class="example-page">
    <h2>Overlay Example</h2>
    <div class="map-container">
      <MapjarMap :center="center" :zoom="zoom">
        <TileLayer 
          id="base-tiles" 
          url-template="https://www.tmsats.com/tile2/api/v1/tile/tdt/img/{z}/{x}/{y}" 
        />
        
        <OverlayLayer id="overlays">
          <MapOverlay 
            v-for="(marker, index) in markers" 
            :key="index"
            :id="`marker-${index}`"
            :position="marker.position"
            :anchor="[0.5, 1]"
          >
            <div class="custom-marker" @click="alert(marker.name)">
              📍
              <span class="tooltip">{{ marker.name }}</span>
            </div>
          </MapOverlay>
        </OverlayLayer>
      </MapjarMap>
    </div>
    <div class="controls">
      <button @click="addMarker">Add Marker at Center</button>
      <button @click="clearMarkers">Clear Markers</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MapjarMap, TileLayer, OverlayLayer, MapOverlay } from '../../lib/main'

const center = ref<[number, number]>([116.3975, 39.9085])
const zoom = ref(10)

interface Marker {
  position: [number, number]
  name: string
}

const markers = ref<Marker[]>([
  { position: [116.3975, 39.9085], name: 'Beijing' }
])

const addMarker = () => {
  markers.value.push({
    position: [center.value[0], center.value[1]],
    name: `Marker ${markers.value.length + 1}`
  })
}

const clearMarkers = () => {
  markers.value = []
}

const alert = (msg: string) => {
  window.alert(`Clicked: ${msg}`)
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

.custom-marker {
  font-size: 24px;
  cursor: pointer;
  position: relative;
  transform: translate(-50%, -100%); /* Handled by anchor usually, but just in case */
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  display: none;
}

.custom-marker:hover .tooltip {
  display: block;
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
