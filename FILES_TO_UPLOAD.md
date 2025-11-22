# GitHub 上传文件清单

## 必须上传的文件

### 根目录文件
- ✅ `index.html` - 前台首页
- ✅ `post.html` - 文章详情页
- ✅ `about.html` - 关于页面
- ✅ `login.html` - 后台登录页
- ✅ `admin.html` - 文章管理页
- ✅ `editor.html` - 文章编辑器
- ✅ `README.md` - 项目说明文档
- ✅ `.gitignore` - Git 忽略文件配置
- ✅ `LICENSE` - 许可证文件（如果有）

### CSS 目录 (css/)
- ✅ `css/style.css` - 全局样式文件

### JavaScript 目录 (js/)
- ✅ `js/main.js` - 首页逻辑
- ✅ `js/post.js` - 文章详情逻辑
- ✅ `js/auth.js` - 认证系统
- ✅ `js/admin.js` - 管理页面逻辑
- ✅ `js/editor.js` - 编辑器逻辑

### Posts 目录 (posts/)
- ⚠️ `posts/posts.json` - 可选（已废弃，使用 localStorage）

## 不需要上传的文件

### IDE 配置文件
- ❌ `.vscode/` - VS Code 配置目录
- ❌ `.idea/` - JetBrains IDE 配置
- ❌ `*.swp`, `*.swo` - Vim 临时文件

### 系统文件
- ❌ `.DS_Store` - macOS 系统文件
- ❌ `Thumbs.db` - Windows 缩略图缓存

### 其他
- ❌ `node_modules/` - Node.js 依赖（如果有）
- ❌ `*.log` - 日志文件

## Git 命令参考

### 初始化仓库
```bash
git init
git add .
git commit -m "Initial commit: Personal blog system"
```

### 关联远程仓库
```bash
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

### 后续更新
```bash
git add .
git commit -m "描述你的更改"
git push
```

## 文件结构预览

```
你的项目/
├── .gitignore
├── README.md
├── LICENSE (可选)
├── index.html
├── post.html
├── about.html
├── login.html
├── admin.html
├── editor.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── post.js
│   ├── auth.js
│   ├── admin.js
│   └── editor.js
└── posts/
    └── posts.json (可选)
```

## 注意事项

1. **不要上传 `.vscode/` 目录** - 这是你本地的编辑器配置
2. **检查 `.gitignore`** - 确保已正确配置
3. **敏感信息** - 虽然这是前端项目，但如果有任何敏感配置，请不要上传
4. **README.md** - 确保包含项目说明、使用方法等
5. **LICENSE** - 建议添加开源许可证（如 MIT）

## 推荐的 GitHub 仓库设置

- **仓库名称**: `personal-blog` 或 `blog-system`
- **描述**: "一个功能完整的个人博客系统，支持 Markdown、评论、文章管理等功能"
- **主题标签**: `blog`, `markdown`, `javascript`, `personal-website`, `cms`
- **GitHub Pages**: 可以启用 GitHub Pages 直接部署
