# 个人博客系统

一个功能完整的个人博客系统，支持前后端分离、文章管理、评论系统等功能。

## 功能特性

### 前端（访客可见）
- **首页** (`index.html`) - 展示所有公开文章，支持分类筛选
- **文章详情** (`post.html`) - 查看文章内容，支持 Markdown 渲染
- **评论系统** - 支持 Markdown 格式评论、表情符号、图片插入
- **关于页面** (`about.html`) - 个人介绍和联系方式
- **响应式设计** - 完美适配移动端和桌面端

### 后端（仅管理员可见）
- **登录系统** (`login.html`) - 管理员身份验证
- **文章管理** (`admin.html`) - 查看、编辑、删除文章
- **文章编辑器** (`editor.html`) - 创建和编辑文章
  - Markdown 编辑器
  - 实时预览
  - 本地图片上传（Base64）
  - 文章分类和可见性设置
- **分类管理** - 动态管理文章分类
  - 添加新分类
  - 重命名分类（自动更新相关文章）
  - 删除分类（保护有文章的分类）
  - 查看每个分类的文章数量
- **统计分析** - 文章数据统计
  - 浏览次数统计
  - 评论数统计
  - 浏览历史记录
  - 总体数据概览
  - 单篇文章详细统计

## 文章权限

- **🌍 公开** - 所有访客可见
- **🔒 私密** - 仅管理员登录后可见

## 技术栈

- 纯前端实现（HTML + CSS + JavaScript）
- Markdown 解析（marked.js）
- 本地存储（localStorage）
- 响应式设计

## 使用说明

### 访客使用
1. 访问 `index.html` 浏览文章
2. 点击文章卡片查看详情
3. 在文章详情页发表评论

### 管理员使用
1. 访问 `login.html` 登录后台
2. 登录后访问 `admin.html` 管理文章
3. 点击"新建文章"创建文章
4. 在编辑器中：
   - 填写标题、分类、摘要
   - 点击分类旁的 ⚙️ 按钮管理分类
     - 添加新分类
     - 重命名现有分类
     - 删除不需要的分类
   - 选择可见性（公开/私密）
   - 上传封面图片（支持本地上传）
   - 使用 Markdown 编写内容
   - 点击"预览"查看效果
   - 点击"保存"发布文章

## 文件结构

```
├── index.html          # 前台首页
├── post.html           # 文章详情页
├── about.html          # 关于页面
├── login.html          # 后台登录页
├── admin.html          # 文章管理页
├── editor.html         # 文章编辑器
├── css/
│   └── style.css       # 全局样式
├── js/
│   ├── main.js            # 首页逻辑
│   ├── post.js            # 文章详情逻辑
│   ├── auth.js            # 认证系统
│   ├── admin.js           # 管理页面逻辑
│   ├── editor.js          # 编辑器逻辑
│   ├── categories.js      # 分类管理模块
│   ├── analytics.js       # 统计分析模块
│   ├── backup.js          # 数据备份模块
│   ├── github-storage.js  # GitHub 存储模块
│   └── github-config.js   # GitHub 配置逻辑
└── posts/
    └── posts.json      # 文章数据（已废弃，使用 localStorage）
```

## 数据存储

### 本地存储（localStorage）
- `blogPosts` - 文章数据
- `blogComments` - 评论数据
- `blogAuth` - 登录状态
- `blogCategories` - 分类列表
- `blogAnalytics` - 文章统计数据（浏览次数、浏览历史等）
- `githubConfig` - GitHub 配置信息

### GitHub 存储（可选）
配置后可将数据同步到 GitHub 仓库：
- 真正的数据持久化
- 跨设备同步
- 版本控制
- 完全免费

详见：[GitHub 存储使用指南](GITHUB_STORAGE_GUIDE.md)

## 注意事项

- 本系统为纯前端实现，适合个人博客或演示使用
- 生产环境建议使用后端服务器和数据库
- 图片使用 Base64 编码存储，建议单张图片不超过 5MB
- 定期备份 localStorage 数据

## 许可证

MIT License
