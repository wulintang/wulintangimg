// /pages/api/images.js
import fetch from 'node-fetch';
import AV from '../../utils/leancloud'; // 根据实际路径引入 leancloud.js

export default async function handler(req, res) {
    const { cid } = req.query;

    if (!cid) {
        return res.status(400).json({ error: '必须提供分类 ID' });
    }

    const imageKey = `${cid}.jpg`;
    const apiUrl = `https://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&cid=${cid}&start=0&count=1&from=360chrome`;

    try {
        let imageBuffer;
        let imageFile;

        // 查询 LeanCloud 文件存储
        const query = new AV.Query('_File');
        query.equalTo('name', imageKey);
        const files = await query.find();

        if (files.length > 0) {
            // 从 LeanCloud 获取文件
            imageFile = files[0];
            imageBuffer = await fetch(imageFile.url()).then(res => res.buffer());
        }

        if (!imageBuffer) {
            // 获取图片数据
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data.data || data.data.length === 0) {
                return res.status(404).json({ error: '没有找到图片' });
            }

            const imageUrl = data.data[0].url;
            imageBuffer = await fetch(imageUrl).then(res => res.buffer());

            // 上传图片到 LeanCloud
            imageFile = new AV.File(imageKey, { base64: imageBuffer.toString('base64') });
            await imageFile.save();
        }

        res.setHeader('Content-Type', 'image/jpeg');
        res.send(imageBuffer);
    } catch (error) {
        res.status(500).json({ error: '获取图片失败' });
    }
}
