# 📚 静态文章系统使用指南

## 🎯 新的文章系统

你的博客现在使用**完全静态的文章系统**，不再依赖 localStorage，支持多设备访问。

### URL 格式
```
https://yourblog.com/posts/分类名/文章名.html
```

### 示例
```
https://yourblog.com/posts/技术/javascript-async-guide.html
https://yourblog.com/posts/教程/css-grid-tutorial.html
https://yourblog.com/posts/随笔/my-first-post.html
```

## 📂 文件结构

```
your-blog/
├── index.html              # 首页
├── posts/
│   ├── index.json         # 文章索引（必需）
│   ├── 技术/
│   │   ├── article-1.html
│   │   └── article-2.html
│   ├── 教程/
│   │   └── tutorial-1.html
│   └── 随笔/
│       └── essay-1.html
├── js/
│   ├── static-loader.js   # 静态文章加载器
│   └── ...
└── ...
```

## 🚀 快速开始

### 步骤 1：生成静态文章

1. 打开 `generate-static-posts.html`
2. 点击"加载文章列表"
3. 点击"生成所有文章 HTML"
4. 点击"生成 index.json"
5. 所有文件会自动下载

### 步骤 2：整理文件

下载的文件名格式：`分类名-文章名.html`

例如：
- `技术-javascript-async-guide.html`
- `教程-css-grid-tutorial.html`

**整理步骤：**
1. 在 `posts/` 目录下创建分类文件夹
2. 将文件重命名（去掉分类前缀）
3. 移动到对应的分类文件夹

**示例：**
```bash
# 创建分类文件夹
mkdir posts/技术
mkdir posts/教程
mkdir posts/随笔

# 移动并重命名文件
mv 技术-javascript-async-guide.html posts/技术/javascript-async-guide.html
mv 教程-css-grid-tutorial.html posts/教程/css-grid-tutorial.html
```

### 步骤 3：上传到 GitHub

```bash
# 1. 添加文件
git add posts/

# 2. 提交
git commit -m "Add static posts"

# 3. 推送
git push origin main
```

### 步骤 4：测试

1. 等待 GitHub Pages 部署（1-2 分钟）
2. 访问你的网站
3. 点击文章，查看 URL 是否为 `/posts/分类/文章名.html`

## 📋 index.json 格式

`posts/index.json` 是文章索引文件，格式如下：

```json
{
  "posts": [
    {
      "id": 1732012345678,
      "title": "JavaScript 异步编程指南",
      "date": "2025-11-22",
      "author": "博主",
      "category": "技术",
      "excerpt": "深入理解 JavaScript 异步编程...",
      "coverImage": "https://example.com/cover.jpg",
      "url": "posts/技术/javascript-async-guide.html",
      "visibility": "public"
    },
    {
      "id": 1732012345679,
      "title": "CSS Grid 布局实战",
      "date": "2025-11-20",
      "author": "博主",
      "category": "教程",
      "excerpt": "通过实际案例学习 CSS Grid...",
      "coverImage": "",
      "url": "posts/教程/css-grid-tutorial.html",
      "visibility": "public"
    }
  ]
}
```

## ✍️ 创建新文章

### 方法 1：使用后台编辑器（推荐）

1. 登录后台 `admin.html`
2. 创建新文章
3. 保存后，打开 `generate-static-posts.html`
4. 重新生成所有文章
5. 上传到 GitHub

### 方法 2：手动创建 HTML

1. 复制现有文章 HTML 作为模板
2. 修改内容
3. 保存到对应的分类文件夹
4. 更新 `posts/index.json`
5. 上传到 GitHub

## 🔄 更新文章

### 更新内容

1. 在后台编辑文章
2. 保存后重新生成 HTML
3. 替换 GitHub 上的对应文件
4. 推送更新

### 更新索引

如果添加/删除文章，需要更新 `index.json`：

1. 打开 `generate-static-posts.html`
2. 点击"生成 index.json"
3. 替换 `posts/index.json`
4. 推送更新

## 🗑️ 删除默认文章

### 清除 localStorage

在浏览器控制台运行：

```javascript
// 清除所有默认文章
localStorage.removeItem('blogPosts');
localStorage.removeItem('blogInitialized');

// 刷新页面
location.reload();
```

### 删除旧文件

删除以下文件（如果存在）：
- `posts/posts.json`（旧的索引文件）
- `post.html`（旧的动态文章页面）
- `js/main.js`（旧的加载器）
- `js/post.js`（旧的文章加载器）

## 🌐 多设备同步

### 工作原理

1. **设备 A**：创建文章 → 生成 HTML → 推送到 GitHub
2. **设备 B**：访问网站 → 从 GitHub 加载 `index.json` → 显示文章列表
3. **点击文章**：直接加载 GitHub 上的 HTML 文件

### 优势

- ✅ 不依赖 localStorage
- ✅ 所有设备看到相同内容
- ✅ 文章永久保存在 GitHub
- ✅ 支持 SEO
- ✅ 加载速度快

## 📊 分类管理

### 添加新分类

1. 在 `posts/` 下创建新文件夹
2. 将文章 HTML 放入该文件夹
3. 更新 `index.json` 中的 `category` 和 `url`
4. 推送到 GitHub

### 重命名分类

1. 重命名 `posts/` 下的文件夹
2. 更新 `index.json` 中所有相关文章的 `category` 和 `url`
3. 推送到 GitHub

### 删除分类

1. 删除 `posts/` 下的文件夹
2. 从 `index.json` 中删除该分类的所有文章
3. 推送到 GitHub

## ⚠️ 注意事项

### 1. 文件命名

- 使用英文或拼音
- 避免特殊字符
- 使用连字符分隔单词
- 保持简短（50 字符以内）

**好的命名：**
- `javascript-async-guide.html`
- `css-grid-tutorial.html`
- `my-first-post.html`

**不好的命名：**
- `JavaScript 异步编程指南.html`（包含空格和中文）
- `article@#$%.html`（包含特殊字符）

### 2. 相对路径

文章 HTML 中的资源路径：
- CSS: `../../css/style.css`
- JS: `../../js/script.js`
- 图片: `../../images/photo.jpg`

### 3. 图片处理

**推荐方案：**
- 使用图床服务（Imgur、SM.MS）
- 或将图片放到 `images/` 目录并推送到 GitHub

**不推荐：**
- Base64 编码（文件太大）
- 本地路径（其他设备无法访问）

### 4. 私密文章

私密文章仍然会生成 HTML 文件，但：
- 不会在首页列表中显示（未登录时）
- 可以通过直接 URL 访问
- 如需真正私密，不要推送到 GitHub

## 🔧 故障排除

### 问题 1：首页不显示文章

**原因：** `posts/index.json` 不存在或格式错误

**解决：**
1. 检查 `posts/index.json` 是否存在
2. 检查 JSON 格式是否正确
3. 打开浏览器控制台查看错误

### 问题 2：点击文章显示 404

**原因：** HTML 文件路径不正确

**解决：**
1. 检查 `index.json` 中的 `url` 是否正确
2. 检查文件是否存在于对应路径
3. 检查文件名是否匹配

### 问题 3：样式丢失

**原因：** CSS 路径不正确

**解决：**
1. 检查 HTML 中的 CSS 路径
2. 应该是 `../../css/style.css`（两级目录）
3. 确认 `css/style.css` 文件存在

### 问题 4：图片不显示

**原因：** 图片路径不正确或图片未上传

**解决：**
1. 使用绝对 URL（图床）
2. 或使用相对路径并上传图片到 GitHub
3. 检查图片 URL 是否可访问

## 📚 相关文档

- `UPLOAD_GUIDE.md` - 文件上传指南
- `GITHUB_STORAGE_GUIDE.md` - GitHub 存储指南
- `BING_WALLPAPER_GUIDE.md` - 背景图片指南

## ✨ 总结

- ✅ 文章存储为静态 HTML 文件
- ✅ URL 格式：`/posts/分类/文章名.html`
- ✅ 通过 `index.json` 管理文章列表
- ✅ 支持多设备访问
- ✅ 不依赖 localStorage
- ✅ SEO 友好

**现在你的博客是一个真正的静态网站！** 🎉

---

**下一步：** 打开 `generate-static-posts.html` 开始生成你的静态文章！
