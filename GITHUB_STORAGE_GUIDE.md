# GitHub 存储使用指南

## 📖 概述

使用 GitHub 作为数据存储，将博客数据保存为 JSON 文件到 GitHub 仓库，实现：
- ✅ 真正的数据持久化
- ✅ 跨设备同步
- ✅ 版本控制和历史记录
- ✅ 完全免费

## 🚀 快速开始

### 步骤 1：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **仓库名**：`blog-data`（或任意名称）
   - **可见性**：选择 **Private**（私有，推荐）
   - 不要勾选任何初始化选项
3. 点击"Create repository"

### 步骤 2：生成 Personal Access Token

1. 访问 https://github.com/settings/tokens/new
2. 填写 Token 信息：
   - **Note**：`Blog Data Access`
   - **Expiration**：选择过期时间（建议 90 天或更长）
   - **Select scopes**：勾选 `repo`（完整仓库访问权限）
3. 点击"Generate token"
4. **重要**：复制生成的 Token（只显示一次！）

### 步骤 3：配置博客系统

1. 登录博客后台
2. 访问"GitHub 配置"页面
3. 填写配置信息：
   - **GitHub 用户名**：你的 GitHub 用户名
   - **仓库名**：刚创建的仓库名（如 `blog-data`）
   - **Personal Access Token**：刚生成的 Token
   - **分支名**：`main`（默认）
4. 点击"保存配置"
5. 点击"测试连接"验证配置

### 步骤 4：推送数据

1. 点击"推送到 GitHub"
2. 确认操作
3. 等待上传完成

## 📁 数据结构

数据将保存在仓库的 `data/` 目录下：

```
你的仓库/
└── data/
    ├── posts.json        # 文章数据
    ├── comments.json     # 评论数据
    ├── categories.json   # 分类列表
    └── analytics.json    # 统计数据
```

## 🔄 数据同步

### 推送到 GitHub（上传）

将本地数据上传到 GitHub：
1. 在"GitHub 配置"页面
2. 点击"⬆️ 推送到 GitHub"
3. 确认操作

**使用场景：**
- 发布新文章后
- 修改文章内容后
- 添加评论后
- 定期备份

### 从 GitHub 拉取（下载）

从 GitHub 下载数据到本地：
1. 在"GitHub 配置"页面
2. 点击"⬇️ 从 GitHub 拉取"
3. 确认操作（会覆盖本地数据）

**使用场景：**
- 换新设备时
- 换新浏览器时
- 恢复数据时

## 💡 工作流程

### 单设备使用

```
写文章 → 发布 → 自动保存到 localStorage
                ↓
         定期推送到 GitHub（手动）
```

### 多设备使用

**设备 A：**
```
写文章 → 发布 → 推送到 GitHub
```

**设备 B：**
```
从 GitHub 拉取 → 查看/编辑文章 → 推送到 GitHub
```

## ⚙️ 配置说明

### GitHub 用户名
你的 GitHub 账号用户名，例如：`username`

### 仓库名
存储数据的仓库名称，例如：`blog-data`

### Personal Access Token
GitHub 访问令牌，需要 `repo` 权限

**权限说明：**
- `repo` - 完整的仓库访问权限（必需）
  - 读取仓库内容
  - 创建和更新文件
  - 提交更改

### 分支名
数据存储的分支，默认 `main`

### 数据路径
数据文件存储路径，默认 `data/`

## 🔒 安全建议

1. **使用私有仓库**
   - 文章内容可能包含敏感信息
   - 私有仓库完全免费

2. **保护 Token**
   - 不要分享你的 Token
   - 定期更换 Token
   - Token 泄露后立即删除

3. **定期备份**
   - GitHub 作为主存储
   - 定期导出 JSON 备份
   - 保存到本地或云盘

4. **权限最小化**
   - Token 只授予必要的权限
   - 使用专门的仓库存储数据

## 🐛 故障排除

### 连接失败

**可能原因：**
- Token 错误或过期
- 仓库名称错误
- 网络问题

**解决方法：**
1. 检查配置信息是否正确
2. 重新生成 Token
3. 检查网络连接

### 推送失败

**可能原因：**
- Token 权限不足
- 仓库不存在
- 文件冲突

**解决方法：**
1. 确认 Token 有 `repo` 权限
2. 确认仓库已创建
3. 先拉取再推送

### 拉取失败

**可能原因：**
- 文件不存在（首次使用）
- Token 权限不足
- 网络问题

**解决方法：**
1. 首次使用先推送数据
2. 检查 Token 权限
3. 检查网络连接

## 📊 与 localStorage 的关系

### 双重存储机制

```
发布文章
    ↓
保存到 localStorage（立即）
    ↓
推送到 GitHub（手动）
```

### 数据优先级

1. **写入**：优先写入 localStorage
2. **读取**：优先从 localStorage 读取
3. **同步**：手动触发 GitHub 同步

### 为什么保留 localStorage？

- ✅ 快速访问（无需网络请求）
- ✅ 离线工作
- ✅ 降低 API 调用次数
- ✅ 作为本地缓存

## 🔄 迁移指南

### 从纯 localStorage 迁移

1. 配置 GitHub 存储
2. 点击"推送到 GitHub"
3. 数据自动上传
4. 完成迁移

### 迁移到新设备

1. 在新设备打开博客
2. 登录后台
3. 配置 GitHub（使用相同配置）
4. 点击"从 GitHub 拉取"
5. 数据自动下载

## 💰 费用说明

### 完全免费

- ✅ GitHub 私有仓库免费
- ✅ API 调用免费
- ✅ 存储空间充足（1GB+）
- ✅ 无隐藏费用

### API 限制

- 未认证：60 次/小时
- 已认证：5000 次/小时
- 对于个人博客完全够用

## 🎯 最佳实践

1. **定期同步**
   - 每次发布文章后推送
   - 每周至少同步一次

2. **多重备份**
   - GitHub 作为主存储
   - 定期导出 JSON 备份
   - 保存到多个位置

3. **版本控制**
   - 利用 GitHub 的版本历史
   - 可以回滚到任意版本

4. **安全第一**
   - 使用私有仓库
   - 保护好 Token
   - 定期更换 Token

## ❓ 常见问题

**Q: 必须使用 GitHub 吗？**
A: 不是必须的，可以继续使用 localStorage，或使用其他存储方案。

**Q: 数据会自动同步吗？**
A: 不会，需要手动点击"推送"或"拉取"按钮。

**Q: 可以在多台电脑上同时编辑吗？**
A: 可以，但需要注意同步顺序，避免数据冲突。

**Q: Token 过期了怎么办？**
A: 重新生成 Token，更新配置即可。

**Q: 可以看到数据的历史版本吗？**
A: 可以，在 GitHub 仓库中查看提交历史。

**Q: 数据安全吗？**
A: 使用私有仓库，数据只有你能访问，非常安全。

## 📚 相关资源

- [GitHub API 文档](https://docs.github.com/en/rest)
- [Personal Access Token 文档](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub 私有仓库说明](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories)

---

**提示：配置完成后，建议立即推送一次数据进行测试！**
