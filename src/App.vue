<template>
  <aside class="sidebar">
    <div class="logo">
      <span>Mapjar Vue</span>
    </div>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/tile-layer">Tile Layer</router-link>
      <router-link to="/vector-layer">Vector Layer</router-link>
      <router-link to="/overlay">Overlays</router-link>
      <router-link to="/geojson">GeoJSON</router-link>
      <router-link to="/others">Other Layers</router-link>
    </nav>
  </aside>
  <main class="content">
    <router-view></router-view>
  </main>
</template>

<style scoped>
.sidebar {
  width: 250px;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
  font-weight: bold;
  font-size: 1.2em;
}

.logo img {
  width: 30px;
  height: 30px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

nav a {
  text-decoration: none;
  color: #333;
  padding: 10px;
  border-radius: 4px;
  transition: background 0.2s;
}

nav a:hover {
  background: #e0e0e0;
}

nav a.router-link-active {
  background: #646cff;
  color: white;
}

.content {
  flex: 1;
  overflow-y: auto;
}
</style>
