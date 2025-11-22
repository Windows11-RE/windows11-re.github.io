# GitHub 存储故障排除

## 常见错误及解决方案

### ❌ 错误 1：Could not create file

**错误信息：**
```
GitHub API 错误: Could not create file. Please try again later.
```

**可能原因：**
1. Token 权限不足
2. 仓库不存在
3. 分支名称错误
4. 网络问题

**解决方法：**

#### 1. 检查 Token 权限
- 访问 https://github.com/settings/tokens
- 确认 Token 有 `repo` 权限（完整仓库访问）
- 如果没有，重新生成 Token 并勾选 `repo`

#### 2. 确认仓库存在
- 访问 `https://github.com/你的用户名/你的仓库名`
- 确认仓库已创建且可以访问
- 如果不存在，创建新仓库

#### 3. 检查分支名称
- 默认分支可能是 `main` 或 `master`
- 在仓库页面查看默认分支名称
- 在配置中使用正确的分支名

#### 4. 测试连接
- 在配置页面点击"测试连接"
- 查看详细错误信息

---

### ❌ 错误 2：Failed to execute 'btoa'

**错误信息：**
```
Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.
```

**原因：**
文章包含中文等非 Latin1 字符

**解决方法：**
已在最新版本中修复，请刷新页面重试

---

### ❌ 错误 3：404 Not Found

**错误信息：**
```
GitHub API 错误 (404): Not Found
```

**可能原因：**
1. 仓库名称错误
2. 用户名错误
3. 仓库是私有的但 Token 无权访问
4. 文件不存在（拉取时）

**解决方法：**

#### 拉取数据时出现 404
- 正常情况，表示 GitHub 上还没有数据
- 先推送数据到 GitHub
- 然后再尝试拉取

#### 推送数据时出现 404
- 检查用户名和仓库名是否正确
- 确认仓库已创建
- 确认 Token 有访问权限

---

### ❌ 错误 4：401 Unauthorized

**错误信息：**
```
GitHub API 错误 (401): Bad credentials
```

**原因：**
Token 无效或已过期

**解决方法：**
1. 重新生成 Token
2. 更新配置中的 Token
3. 点击"测试连接"验证

---

### ❌ 错误 5：403 Forbidden

**错误信息：**
```
GitHub API 错误 (403): Resource not accessible by integration
```

**原因：**
Token 权限不足

**解决方法：**
1. 访问 https://github.com/settings/tokens
2. 编辑或重新生成 Token
3. 确保勾选 `repo` 权限
4. 更新配置

---

### ❌ 错误 6：422 Unprocessable Entity

**错误信息：**
```
GitHub API 错误 (422): Invalid request
```

**可能原因：**
1. SHA 不匹配（文件已被修改）
2. 数据格式错误
3. 文件名包含非法字符

**解决方法：**
1. 清除缓存：`githubStorage.clearCache()`
2. 重新拉取数据
3. 再次推送

---

## 🔍 调试步骤

### 1. 检查配置
```javascript
// 在浏览器控制台执行
console.log(githubStorage.config);
```

确认：
- ✅ owner（用户名）正确
- ✅ repo（仓库名）正确
- ✅ token 不为空
- ✅ branch 正确

### 2. 测试 Token
```javascript
// 在浏览器控制台执行
fetch('https://api.github.com/user', {
    headers: {
        'Authorization': 'token 你的TOKEN'
    }
}).then(r => r.json()).then(console.log);
```

应该返回你的 GitHub 用户信息

### 3. 检查仓库访问
```javascript
// 在浏览器控制台执行
fetch('https://api.github.com/repos/用户名/仓库名', {
    headers: {
        'Authorization': 'token 你的TOKEN'
    }
}).then(r => r.json()).then(console.log);
```

应该返回仓库信息

### 4. 查看详细错误
打开浏览器开发者工具（F12）：
- 切换到 Console 标签
- 查看红色错误信息
- 复制完整错误信息

---

## 💡 最佳实践

### 1. 首次配置
```
创建仓库 → 生成 Token → 配置博客 → 测试连接 → 推送数据
```

### 2. 日常使用
```
写文章 → 保存 → 推送到 GitHub（每天或每周）
```

### 3. 换设备
```
配置 GitHub → 测试连接 → 从 GitHub 拉取 → 开始使用
```

### 4. 遇到问题
```
查看错误信息 → 检查配置 → 测试连接 → 查看本指南
```

---

## 🆘 仍然无法解决？

### 检查清单

- [ ] 仓库已创建
- [ ] Token 已生成且有 `repo` 权限
- [ ] 配置信息正确无误
- [ ] 网络连接正常
- [ ] 浏览器控制台无其他错误

### 手动验证

1. **访问仓库**
   ```
   https://github.com/你的用户名/你的仓库名
   ```
   确认可以访问

2. **检查 Token**
   ```
   https://github.com/settings/tokens
   ```
   确认 Token 存在且有权限

3. **测试 API**
   使用 Postman 或 curl 测试 GitHub API

### 临时方案

如果 GitHub 存储暂时无法使用：
1. 使用"导出备份"功能保存数据
2. 继续使用 localStorage
3. 定期手动备份

---

## 📞 获取帮助

如果以上方法都无法解决问题：

1. 记录完整的错误信息
2. 记录你的操作步骤
3. 检查 GitHub Status: https://www.githubstatus.com/
4. 查看 GitHub API 文档: https://docs.github.com/en/rest

---

**提示：大多数问题都是配置错误导致的，仔细检查配置信息通常能解决问题！**
