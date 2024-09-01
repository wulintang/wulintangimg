<template>
  <div class="container">
    <header>
      <h1>随机图片 API</h1>
    </header>
    <main>
      <p>使用 <code>/api/images?cid=6</code> 获取指定分类（cid）的随机图片。</p>
      <p>例如：<a :href="getExampleLink(6)">/api/images?cid=6</a> 获取美女模特分类的随机图片。</p>
      <p>使用 <code>/api/categories</code> 获取所有分类的列表。</p>
    </main>
    <footer>
      <p>&copy; 2024 随机图片服务</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    getExampleLink(cid) {
      return `/api/images?cid=${cid}`;
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  font-family: 'Arial, sans-serif';
  padding: 20px;
  text-align: center;
  background: #f5f5f5;
}

header h1 {
  color: #333;
  font-size: 2.5em;
  margin-bottom: 0.5em;
}

main p {
  font-size: 1.2em;
  color: #666;
  line-height: 1.5;
}

a {
  color: #1e88e5;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

footer {
  margin-top: 20px;
  color: #999;
  font-size: 0.9em;
}
</style>
