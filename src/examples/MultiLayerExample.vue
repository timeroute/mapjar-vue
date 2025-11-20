<template>
  <div class="example">
    <h2>多图层示例</h2>
    <div class="map-container">
      <MapjarMap :center="center" :zoom="zoom" @load="onMapLoad">
        <!-- 基础地图图层 -->
        <TileLayer v-if="showOSM" id="osm-base" url-template="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          :tile-scale="tileScale" />

        <!-- 卫星图层 -->
        <TileLayer v-if="showSatellite" id="satellite"
          url-template="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          :tile-scale="tileScale" />
      </MapjarMap>
    </div>

    <div class="controls">
      <div class="control-group">
        <h3>图层控制</h3>
        <label>
          <input v-model="showOSM" type="checkbox" />
          OpenStreetMap
        </label>
        <label>
          <input v-model="showSatellite" type="checkbox" />
          卫星图层
        </label>
      </div>

      <div class="control-group">
        <h3>地图控制</h3>
        <button @click="zoom++">放大</button>
        <button @click="zoom--">缩小</button>
        <button @click="resetView">重置</button>
      </div>

      <div class="control-group">
        <h3>瓦片缩放</h3>
        <label>{{ tileScale.toFixed(1) }}</label>
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
const showOSM = ref(true)
const showSatellite = ref(false)

const onMapLoad = (mapEngine: MapEngine) => {
  console.log('地图加载完成', mapEngine)
}

const resetView = () => {
  center.value = [116.3975, 39.9085]
  zoom.value = 10
}
</script>

<style scoped>
.example {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
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
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #f9f9f9;
}

.control-group h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.control-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
}

.control-group input[type='checkbox'] {
  cursor: pointer;
}

.control-group input[type='range'] {
  width: 150px;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #646cff;
  background: #646cff;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background: #535bf2;
}
</style>
