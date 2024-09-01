// /pages/api/images.js

export default async function handler(req, res) {
    const { cid } = req.query;
    
    if (!cid) {
        res.status(400).json({ error: 'Missing cid parameter' });
        return;
    }
    
    const url = `http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&cid=${cid}&start=0&count=20&from=360chrome`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.data && data.data.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.data.length);
            const imageUrl = data.data[randomIndex].url;

            res.redirect(imageUrl);
        } else {
            res.status(404).json({ error: 'No images found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch images' });
    }
}
