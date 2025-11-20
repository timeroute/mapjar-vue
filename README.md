# Mapjar Vue

基于 [mapjar](https://github.com/pzq123456/mapjar) 地图引擎的 Vue 3 组件库。

## 项目结构

```
mapjar-vue/
├── lib/                    # 组件库源码
│   ├── components/         # Vue 组件
│   │   └── MapjarMap.vue  # 地图组件
│   ├── types/             # TypeScript 类型定义
│   │   └── index.ts
│   └── main.ts            # 组件库入口
├── src/                   # 测试应用
│   ├── App.vue           # 测试页面
│   ├── main.ts           # 应用入口
│   └── style.css         # 样式
├── index.d.ts            # 类型声明文件
├── package.json
├── tsconfig.json
└── vite.config.ts        # Vite 配置
```

## 开发

### 安装依赖

```bash
bun install
```

### 启动开发服务器

```bash
bun run dev
```

访问 http://localhost:5173 查看测试页面。

### 构建组件库

```bash
bun run build
```

构建产物会输出到 `dist/` 目录。

## 使用

### 安装

```bash
npm install mapjar-vue
# 或
bun add mapjar-vue
```

### 基本用法

```vue
<template>
  <div class="map-container">
    <MapjarMap
      :center="[116.3975, 39.9085]"
      :zoom="10"
      @load="onMapLoad"
      @error="onMapError"
    >
      <TileLayer
        id="osm-tiles"
        url-template="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapjarMap>
  </div>
</template>

<script setup lang="ts">
import { MapjarMap, TileLayer } from 'mapjar-vue'
import type { MapEngine } from 'mapjar'

const onMapLoad = (mapEngine: MapEngine) => {
  console.log('地图加载完成', mapEngine)
}

const onMapError = (error: Error) => {
  console.error('地图加载失败', error)
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 600px;
}
</style>
```

## API

### MapjarMap 组件

地图容器组件，所有图层组件必须作为其子组件使用。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| center | `[number, number]` | `[120, 30]` | 地图中心点 [经度, 纬度] |
| zoom | `number` | `10` | 缩放级别 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| load | `(mapEngine: MapEngine)` | 地图加载完成时触发 |
| error | `(error: Error)` | 地图加载失败时触发 |

#### Slots

| 插槽 | 说明 |
|------|------|
| default | 用于放置图层组件（TileLayer 等） |

#### Methods

通过 ref 可以访问组件实例方法：

```vue
<script setup>
import { ref } from 'vue'

const mapRef = ref()

// 获取 MapEngine 实例
const mapEngine = mapRef.value?.getMapEngine()
</script>

<template>
  <MapjarMap ref="mapRef">
    <TileLayer id="tiles" url-template="..." />
  </MapjarMap>
</template>
```

### TileLayer 组件

瓦片图层组件，用于显示栅格瓦片地图。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| id | `string` | - | 图层唯一标识（必填） |
| urlTemplate | `string` | - | 瓦片 URL 模板，支持 `{z}`, `{x}`, `{y}` 占位符（必填） |
| maxConcurrent | `number` | `6` | 最大并发请求数 |
| tileScale | `number` | `1` | 瓦片缩放比例（0.5 - 3.0） |
| wrapX | `boolean` | `true` | 是否在 X 轴方向循环 |
| fadeInDuration | `number` | `300` | 瓦片淡入动画时长（毫秒） |

#### 示例

```vue
<template>
  <MapjarMap :center="[116.3975, 39.9085]" :zoom="10">
    <!-- OpenStreetMap 瓦片 -->
    <TileLayer
      id="osm"
      url-template="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    
    <!-- 自定义瓦片服务 -->
    <TileLayer
      id="custom"
      url-template="https://your-tile-server.com/{z}/{x}/{y}.png"
      :tile-scale="1.5"
      :max-concurrent="8"
    />
  </MapjarMap>
</template>
```

#### Methods

通过 ref 可以访问图层实例：

```vue
<script setup>
import { ref } from 'vue'

const tileLayerRef = ref()

// 获取 TileLayer 实例
const tileLayer = tileLayerRef.value?.getTileLayer()
</script>

<template>
  <MapjarMap>
    <TileLayer ref="tileLayerRef" id="tiles" url-template="..." />
  </MapjarMap>
</template>
```

## License

MIT
