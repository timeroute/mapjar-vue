import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import TileLayerExample from '../views/TileLayerExample.vue'
import VectorLayerExample from '../views/VectorLayerExample.vue'
import OverlayExample from '../views/OverlayExample.vue'
import GeoJSONExample from '../views/GeoJSONExample.vue'
import OtherLayersExample from '../views/OtherLayersExample.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/tile-layer',
            name: 'tile-layer',
            component: TileLayerExample
        },
        {
            path: '/vector-layer',
            name: 'vector-layer',
            component: VectorLayerExample
        },
        {
            path: '/overlay',
            name: 'overlay',
            component: OverlayExample
        },
        {
            path: '/geojson',
            name: 'geojson',
            component: GeoJSONExample
        },
        {
            path: '/others',
            name: 'others',
            component: OtherLayersExample
        }
    ]
})

export default router
