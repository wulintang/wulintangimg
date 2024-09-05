import fetch from 'node-fetch';
import fs from 'fs';
import sharp from 'sharp'; // 引入 sharp
import path from 'path';

const progressFilePath = '/tmp/image_progress.json';

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

    const url = `http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&cid=${cid}&start=0&count=100&from=360chrome`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        return res.status(404).json({ error: 'No images found in the API response' });
      }

      // 读取进度文件，如果存在
      let progress = 0;
      if (fs.existsSync(progressFilePath)) {
        progress = JSON.parse(fs.readFileSync(progressFilePath, 'utf8')).progress || 0;
      }

      // 获取当前图片
      const imageIndex = progress % data.data.length;
      const item = data.data[imageIndex];

      if (item && item.url) {
        // 获取图片数据
        const imageResponse = await fetch(item.url);
        const imageBuffer = await imageResponse.buffer();

        // 转换为 WebP 格式
        const webpBuffer = await sharp(imageBuffer)
          .webp({ quality: 80 }) // 你可以根据需要调整质量
          .toBuffer();

        res.setHeader('Content-Type', 'image/webp');
        res.status(200).send(webpBuffer);

        // 更新进度
        progress += 1;
        fs.writeFileSync(progressFilePath, JSON.stringify({ progress }));
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
