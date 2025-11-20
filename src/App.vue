<template>
  <div id="app">
    <h1>Mapjar Vue 组件测试</h1>
    <div class="map-container">
      <MapjarMap :center="center" :zoom="zoom" @load="onMapLoad" @error="onMapError">
        <TileLayer id="osm-tiles" url-template="https://www.tmsats.com/tile2/api/v1/tile/tdt/img/{z}/{x}/{y}"
          :tile-scale="tileScale" />
      </MapjarMap>
    </div>
    <div class="controls">
      <button @click="zoom++">放大</button>
      <button @click="zoom--">缩小</button>
      <button @click="resetView">重置视图</button>
      <div class="slider-control">
        <label>瓦片缩放: {{ tileScale.toFixed(1) }}</label>
        <input v-model.number="tileScale" type="range" min="0.5" max="3" step="0.1" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MapjarMap, TileLayer } from '../lib/main'
import type { MapEngine } from 'mapjar'

const center = ref<[number, number]>([116.3975, 39.9085]) // 北京
const zoom = ref(10)
const tileScale = ref(1)

const onMapLoad = (mapEngine: MapEngine) => {
  console.log('地图加载完成', mapEngine)
}

const onMapError = (error: Error) => {
  console.error('地图加载失败', error)
}

const resetView = () => {
  center.value = [116.3975, 39.9085]
  zoom.value = 10
}
</script>

<style scoped>
#app {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
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
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.slider-control {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.slider-control label {
  font-size: 14px;
  color: #666;
}

.slider-control input[type='range'] {
  width: 200px;
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
