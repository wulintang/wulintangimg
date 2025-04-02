import fetch from 'node-fetch';
import fs from 'fs';
import sharp from 'sharp';
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

        let allImages = [];
        let start = 0;
        const count = 100;

        while (true) {
            const url = `http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&cid=${cid}&start=${start}&count=${count}&from=360chrome`;
            try {
                const response = await fetch(url);
                const data = await response.json();

                if (!data.data || data.data.length === 0) {
                    break;
                }

                allImages = allImages.concat(data.data);
                start += count;
            } catch (error) {
                return res.status(500).json({ error: 'Failed to fetch images' });
            }
        }

        if (allImages.length === 0) {
            return res.status(404).json({ error: 'No images found in the API response' });
        }

        const webpImages = [];
        for (const item of allImages) {
            if (item && item.url) {
                try {
                    const imageResponse = await fetch(item.url);
                    const imageBuffer = await imageResponse.buffer();
                    const webpBuffer = await sharp(imageBuffer)
                       .webp({ quality: 80 })
                       .toBuffer();
                    webpImages.push(webpBuffer);
                } catch (error) {
                    console.error(`Failed to convert image: ${error.message}`);
                }
            }
        }

        if (webpImages.length === 0) {
            return res.status(404).json({ error: 'No valid image URLs found' });
        }

        // 这里可以根据需求调整返回方式，例如返回图片数组或者打包成 zip 文件等
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ images: webpImages.map(buffer => buffer.toString('base64')) });
    } else {
        res.status(400).json({ error: 'Invalid action' });
    }
}
