<template>
  <div class="home">
    <h1>Mapjar Vue Examples</h1>
    <p>Welcome to the Mapjar Vue component library examples.</p>
    <div class="links">
      <router-link to="/tile-layer" class="card">
        <h2>Tile Layer</h2>
        <p>Basic map with tile layers and zoom controls.</p>
      </router-link>
      <router-link to="/vector-layer" class="card">
        <h2>Vector Layer</h2>
        <p>Points, lines, and polygons.</p>
      </router-link>
      <router-link to="/overlay" class="card">
        <h2>Overlays</h2>
        <p>HTML markers and overlays.</p>
      </router-link>
      <router-link to="/geojson" class="card">
        <h2>GeoJSON</h2>
        <p>Loading GeoJSON data.</p>
      </router-link>
      <router-link to="/others" class="card">
        <h2>Other Layers</h2>
        <p>Images, Wind, and Heatmaps.</p>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.card {
  display: block;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  border-color: #646cff;
}

h2 {
  margin-top: 0;
  color: #646cff;
}

p {
  color: #666;
}
</style>
