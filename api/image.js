import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// 缓存时间（秒）
const CACHE_DURATION = 60 * 10; // 10分钟
const cacheDir = '/tmp/img';

// 确保缓存目录存在
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

export default async function handler(req, res) {
  const action = req.query.action || 'list';

  if (action === 'list') {
    // 获取分类列表
    const url = "http://cdn.apc.360.cn/index.php?c=WallPaper&a=getAllCategoriesV2&from=360chrome";
    try {
      const response = await fetch(url);
      const categories = await response.json();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch category list' });
    }
  } else if (action === 'get_images') {
    // 获取某个分类下的图片
    const cid = req.query.cid || '';
    if (!cid) {
      return res.status(400).json({ error: 'No category ID provided' });
    }

    const start = req.query.start || 0;
    const count = req.query.count || 10;
    const url = `http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&cid=${cid}&start=${start}&count=${count}&from=360chrome`;

    const cacheFile = path.join(cacheDir, `${cid}.jpg`);
    const now = Date.now();

    // 检查缓存文件是否存在且未过期
    if (fs.existsSync(cacheFile)) {
      const stats = fs.statSync(cacheFile);
      const fileAge = (now - stats.mtimeMs) / 1000;

      if (fileAge < CACHE_DURATION) {
        // 缓存未过期，返回缓存图片
        res.setHeader('Content-Type', 'image/jpeg');
        return res.sendFile(cacheFile);
      }
    }

    try {
      const response = await fetch(url, { timeout: 5000 }); // 5秒超时
      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        return res.status(404).json({ error: 'No images found in the API response' });
      }

      // 随机选择一张图片
      const item = data.data[Math.floor(Math.random() * data.data.length)];
      if (item.url) {
        const imageResponse = await fetch(item.url, { timeout: 5000 }); // 5秒超时
        const imageData = await imageResponse.buffer();

        // 保存到缓存目录
        fs.writeFileSync(cacheFile, imageData);

        // 设置缓存头，并返回图片
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', `public, max-age=${CACHE_DURATION}`);
        return res.send(imageData);
      } else {
        return res.status(404).json({ error: 'No valid image URLs found' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch images' });
    }
  } else {
    res.status(400).json({ error: 'Invalid action' });
  }
}
