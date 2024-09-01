import AV from '../../utils/leancloud';

export default async function handler(req, res) {
    const { cid } = req.query;

    if (!cid) {
        return res.status(400).json({ error: 'Category ID is required' });
    }

    try {
        // 这里假设有一个查询 LeanCloud 的逻辑
        const query = new AV.Query('ImageCache');
        query.equalTo('cid', cid);
        const results = await query.find();

        if (results.length === 0) {
            // 如果缓存没有图片，调用你的图片 API 获取并缓存
            const images = await fetchAndCacheImages(cid);
            return res.status(200).json(images);
        }

        // 返回缓存的图片
        const images = results.map(result => result.toJSON());
        return res.status(200).json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
