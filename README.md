# 随机图片

## 项目说明

这是一个在 Vercel 上托管的图片缓存服务，使用 LeanCloud 进行图片的存储和缓存。

## 使用方法

1. 在 Vercel 中配置环境变量 `LEANCLOUD_APP_ID` 和 `LEANCLOUD_APP_KEY`。
2. 访问 `/api/categories` 获取所有分类。
3. 访问 `/api/images?cid=<分类ID>` 获取对应分类的图片。如果图片尚未缓存，服务会从远程 API 拉取并缓存图片。

## 示例

要获取分类 ID 为 6 的图片，请访问：`/api/images?cid=6`
