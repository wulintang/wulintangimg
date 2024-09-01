// api/categories.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
    const url = 'http://cdn.apc.360.cn/index.php?c=WallPaper&a=getAllCategoriesV2&from=360chrome';

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
