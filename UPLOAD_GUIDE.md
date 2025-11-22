# GitHub 上传指南

## 📦 需要上传的文件列表

### ✅ 必须上传（14个文件 + 5个JS文件 + 1个CSS文件）

**根目录 HTML 文件：**
1. `index.html` - 前台首页
2. `post.html` - 文章详情页
3. `about.html` - 关于页面
4. `login.html` - 后台登录页
5. `admin.html` - 文章管理页
6. `editor.html` - 文章编辑器

**配置和文档：**
7. `README.md` - 项目说明
8. `.gitignore` - Git 忽略配置
9. `.gitattributes` - Git 属性配置
10. `LICENSE` - 许可证

**CSS 文件（css/ 目录）：**
11. `css/style.css` - 全局样式

**JavaScript 文件（js/ 目录）：**
12. `js/main.js` - 首页逻辑
13. `js/post.js` - 文章详情逻辑
14. `js/auth.js` - 认证系统
15. `js/admin.js` - 管理页面逻辑
16. `js/editor.js` - 编辑器逻辑

**可选文件：**
- `posts/posts.json` - 文章数据（已废弃，但可以保留）

### ❌ 不要上传

- `.vscode/` - VS Code 配置目录（已在 .gitignore 中）
- 任何临时文件或系统文件

---

## 🚀 快速上传步骤

### 方法一：使用 Git 命令行

#### 1. 初始化 Git 仓库（如果还没有）
```bash
git init
```

#### 2. 添加所有文件
```bash
git add .
```

#### 3. 提交更改
```bash
git commit -m "Initial commit: Personal blog system with admin panel"
```

#### 4. 在 GitHub 创建新仓库
- 访问 https://github.com/new
- 输入仓库名称（如：`personal-blog`）
- 选择 Public 或 Private
- **不要**勾选 "Initialize with README"（因为你已经有了）
- 点击 "Create repository"

#### 5. 关联远程仓库并推送
```bash
# 替换为你的 GitHub 用户名和仓库名
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

---

### 方法二：使用 GitHub Desktop

#### 1. 打开 GitHub Desktop
#### 2. File → Add Local Repository
#### 3. 选择你的项目文件夹
#### 4. 点击 "Publish repository"
#### 5. 填写仓库信息并发布

---

### 方法三：直接在 GitHub 网页上传

#### 1. 在 GitHub 创建新仓库
#### 2. 点击 "uploading an existing file"
#### 3. 拖拽所有文件到页面
#### 4. 提交更改

⚠️ **注意**：这种方法需要手动创建文件夹结构

---

## 📋 上传前检查清单

- [ ] 确认 `.gitignore` 文件存在
- [ ] 确认 `README.md` 内容完整
- [ ] 检查是否有敏感信息（密码、密钥等）
- [ ] 确认所有 HTML、CSS、JS 文件都在
- [ ] 测试本地功能是否正常

---

## 🌐 启用 GitHub Pages（可选）

上传后，可以通过 GitHub Pages 直接访问你的博客：

1. 进入仓库的 Settings
2. 找到 "Pages" 选项
3. Source 选择 "main" 分支
4. 点击 Save
5. 等待几分钟，访问 `https://你的用户名.github.io/仓库名/`

---

## 📝 推荐的仓库信息

**仓库名称：**
- `personal-blog`
- `blog-system`
- `markdown-blog`

**描述：**
```
一个功能完整的个人博客系统 | 支持 Markdown 编辑、评论系统、文章管理、权限控制
```

**主题标签（Topics）：**
```
blog, markdown, javascript, cms, personal-website, 
admin-panel, comment-system, responsive-design
```

---

## 🔄 后续更新流程

当你修改了代码后：

```bash
# 1. 查看修改的文件
git status

# 2. 添加修改的文件
git add .

# 3. 提交更改
git commit -m "描述你的更改内容"

# 4. 推送到 GitHub
git push
```

---

## ⚠️ 常见问题

### Q: 上传后访问显示 404？
A: 确保启用了 GitHub Pages，并且访问的是正确的 URL

### Q: 图片无法显示？
A: 检查图片路径是否正确，GitHub Pages 区分大小写

### Q: 登录功能不工作？
A: localStorage 在某些浏览器的 file:// 协议下可能不工作，需要通过 HTTP 服务器访问

### Q: 如何修改管理员密码？
A: 编辑 `js/auth.js` 文件中的 `DEFAULT_ADMIN` 对象

---

## 📞 需要帮助？

如果遇到问题，可以：
1. 查看 GitHub 官方文档
2. 在仓库中创建 Issue
3. 查看项目的 README.md

---

**祝你上传顺利！🎉**
