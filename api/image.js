import fetch from 'node-fetch';

export default async function handler(req, res) {
  const action = req.query.action || 'list';
  const cacheDir = '/tmp/img';

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
    const count = req.query.count || 10000;
    const url = `http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&cid=${cid}&start=${start}&count=${count}&from=360chrome`;

    try {
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
