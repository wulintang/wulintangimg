// /pages/index.js
import { useEffect, useState } from 'react';

export default function Home() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch('/api/categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        }
        fetchCategories();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>欢迎使用图片缓存服务</h1>
            <p>这个服务可以根据分类 ID 提供图片，并进行缓存。</p>
            <h2>使用说明</h2>
            <ol>
                <li>访问 <code>/api/images?cid=<span style={{ color: 'blue' }}>分类ID</span></code>，可以获取对应分类的图片。</li>
                <li>如果图片尚未缓存，服务会从远程 API 拉取并缓存图片。</li>
                <li>如果图片已经缓存，下次访问将直接使用缓存的图片。</li>
            </ol>
            <h2>分类列表</h2>
            <ul>
                {categories.map(category => (
                    <li key={category.id}>
                        <a href={`/api/images?cid=${category.id}`}>
                            {category.name} (ID: {category.id})
                        </a>
                    </li>
                ))}
            </ul>
            <h2>示例</h2>
            <p>要获取分类 ID 为 6 的图片，请访问：<a href="/api/images?cid=6">/api/images?cid=6</a></p>
        </div>
    );
}
