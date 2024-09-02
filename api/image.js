import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const cacheFilePath = '/tmp/recent_images_cache.json';
const cacheSize = 50;  // 缓存最多保留的图片数量

export default async function handler(req, res) {
  const action = req.query.action || 'list';

  if (action === 'list') {
    const url = "http://cdn.apc.360.cn/index.php?c=WallPaper&a=getAllCategoriesV2&from=360chrome";
    try {
      const response = await fetch(url);
      const categories = await response.json();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch category list' });
    }
  } else if (action === 'get_images') {
    const cid = req.query.cid || '';
    if (!cid) {
      return res.status(400).json({ error: 'No category ID provided' });
    }

    const start = req.query.start || 0;
    const count = req.query.count || 20;
    const url = `http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&cid=${cid}&start=${start}&count=${count}&from=360chrome`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        return res.status(404).json({ error: 'No images found in the API response' });
      }

      // 读取缓存文件，如果存在
      let recentImages = [];
      if (fs.existsSync(cacheFilePath)) {
        recentImages = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
      }

      // 尝试随机选择一张不在缓存中的图片
      let item;
      for (let i = 0; i < data.data.length; i++) {
        item = data.data[Math.floor(Math.random() * data.data.length)];
        if (!recentImages.includes(item.url)) {
          break;
        }
      }

      if (item && item.url) {
        const imageResponse = await fetch(item.url);
        const imageData = await imageResponse.buffer();
        res.setHeader('Content-Type', 'image/jpeg');

        // 更新缓存
        recentImages.push(item.url);
        if (recentImages.length > cacheSize) {
          recentImages.shift();  // 超过缓存大小时，移除最早的一张图片
        }
        fs.writeFileSync(cacheFilePath, JSON.stringify(recentImages));

        return res.status(200).send(imageData);
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
