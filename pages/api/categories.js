// /pages/api/categories.js

export default async function handler(req, res) {
    const url = "http://cdn.apc.360.cn/index.php?c=WallPaper&a=getAllCategoriesV2&from=360chrome";

    try {
        const response = await fetch(url);
        const categories = await response.json();

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
}
