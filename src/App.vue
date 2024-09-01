<template>
  <div id="app">
    <h1>Image Categories</h1>
    <ul>
      <li v-for="category in categories" :key="category.id">
        <a :href="'/api/images?cid=' + category.id" target="_blank">
          {{ category.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: []
    };
  },
  async created() {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      this.categories = data.data || [];
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
