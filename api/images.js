// api/images.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { cid } = req.query;
    
    if (!cid) {
        return res.status(400).json({ error: 'No category ID provided' });
    }
    
    const url = `http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&cid=${cid}&start=0&count=1&from=360chrome`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            const imageUrl = data.data[0].url;
            res.redirect(imageUrl); // Redirect to the image URL
        } else {
            res.status(404).json({ error: 'No images found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
