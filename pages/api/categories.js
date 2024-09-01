// /pages/api/categories.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
    const apiUrl = 'http://cdn.apc.360.cn/index.php?c=WallPaper&a=getAllCategoriesV2&from=360chrome';

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data || !data.data) {
            return res.status(404).json({ error: '无法获取分类数据' });
        }

        res.status(200).json(data.data);
    } catch (error) {
        res.status(500).json({ error: '获取分类失败' });
    }
}
