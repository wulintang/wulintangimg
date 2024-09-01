// api/image.js

import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { action = 'list', cid = '', start = 0, count = 10 } = req.query;

  switch (action) {
    case 'list':
      return handleList(res);
    
    case 'get_images':
      return handleGetImages(cid, start, count, res);

    default:
      return res.status(400).json({ error: 'Invalid action' });
  }
}

async function handleList(res) {
  try {
    const url = "http://cdn.apc.360.cn/index.php?c=WallPaper&a=getAllCategoriesV2&from=360chrome";
    const response = await fetch(url);
    const categories = await response.json();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

async function handleGetImages(cid, start, count, res) {
  if (!cid) {
    return res.status(400).json({ error: 'No category ID provided' });
  }

  try {
    const url = `http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&cid=${cid}&start=${start}&count=${count}&from=360chrome`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return res.status(404).json({ error: 'No images found in the API response' });
    }

    // 随机选择一张图片
    const item = data.data[Math.floor(Math.random() * data.data.length)];
    if (item.url) {
      const imageResponse = await fetch(item.url);
      const imageData = await imageResponse.buffer();
      res.setHeader('Content-Type', 'image/jpeg');
      res.status(200).send(imageData);
    } else {
      res.status(404).json({ error: 'No valid image URLs found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
}
