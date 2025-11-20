import type { MapEngine } from 'mapjar'

export interface MapjarMapProps {
  center?: [number, number]
  zoom?: number
}

export interface MapjarMapEmits {
  (e: 'load', mapEngine: MapEngine): void
  (e: 'error', error: Error): void
}
export interface TileLayerProps {
  id: string
  urlTemplate: string
  maxConcurrent?: number
  tileScale?: number
  wrapX?: boolean
  fadeInDuration?: number
}
