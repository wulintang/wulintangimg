# 随机图片
## 项目说明
这是一个在 Vercel 上托管的图片缓存服务，使用 LeanCloud 进行图片的存储和缓存。
## 使用方法
访问 `/api/image` 获取所有分类。
访问 `/image?action=get_images&cid=分类` 获取对应分类的图片。如果图片尚未缓存，服务会从远程 API 拉取并缓存图片。
## 示例
要获取分类 ID 为 6 的图片，请访问：`/image?action=get_images&cid=6`
