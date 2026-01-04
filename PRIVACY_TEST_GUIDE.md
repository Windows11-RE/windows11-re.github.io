# 私密文章功能测试指南

## 🔒 功能说明

私密文章功能确保标记为"私密"的文章只有登录的管理员可以看到，访客无法访问。

## ✅ 保护机制

### 1. 首页列表保护

**代码位置：** `js/main.js` - `getPosts()` 和 `loadPosts()`

**保护逻辑：**
```javascript
// 第一层：getPosts() 过滤
if (!isAuthenticated()) {
    return allPosts.filter(p => p.visibility !== 'private');
}

// 第二层：loadPosts() 双重过滤
const publicPosts = filteredPosts.filter(p => {
    if (!p.visibility) return true;
    return p.visibility === 'public';
});
```

**效果：**
- ✅ 未登录访客：只看到公开文章
- ✅ 已登录管理员：看到所有文章

### 2. 文章详情页保护

**代码位置：** `js/post.js` - `loadPostDetail()`

**保护逻辑：**
```javascript
if (post.visibility === 'private' && !isAuthenticated()) {
    // 显示"私密文章"提示
    // 提供登录链接
    return;
}
```

**效果：**
- ✅ 未登录访客访问私密文章：显示"🔒 私密文章"提示
- ✅ 已登录管理员：正常显示文章内容

### 3. 生成的 HTML 文件

**注意：** 生成的静态 HTML 文件不包含权限检查！

**建议：**
- 不要为私密文章生成 HTML 文件
- 或者不要将私密文章的 HTML 上传到 GitHub

## 🧪 测试步骤

### 测试 1：首页列表

#### 步骤：
1. 创建一篇私密文章
   - 后台 → 新建文章
   - 标题：`测试私密文章`
   - 可见性：选择 `🔒 私密`
   - 保存

2. 退出登录
   - 点击"登出"按钮

3. 访问首页
   - 打开 `index.html`
   - 检查文章列表

#### 预期结果：
- ❌ 私密文章不应该出现在列表中
- ✅ 只显示公开文章

#### 如果失败：
- 刷新页面（Ctrl+F5）
- 清除浏览器缓存
- 检查文章的 `visibility` 字段是否为 `private`

### 测试 2：直接访问私密文章

#### 步骤：
1. 记下私密文章的 ID（如：5）

2. 退出登录

3. 直接访问文章
   - 打开 `post.html?id=5`

#### 预期结果：
- ❌ 不显示文章内容
- ✅ 显示"🔒 私密文章"提示
- ✅ 提供"登录查看"按钮

### 测试 3：登录后访问

#### 步骤：
1. 点击"登录查看"按钮

2. 输入管理员账号密码

3. 登录后返回首页

4. 检查文章列表

#### 预期结果：
- ✅ 私密文章出现在列表中
- ✅ 可以正常访问私密文章

### 测试 4：分类筛选

#### 步骤：
1. 创建不同分类的私密文章

2. 退出登录

3. 使用分类筛选

#### 预期结果：
- ✅ 所有分类下都不显示私密文章
- ✅ 只显示该分类的公开文章

## 🔍 调试方法

### 检查文章数据

在浏览器控制台执行：

```javascript
// 查看所有文章
const allPosts = JSON.parse(localStorage.getItem('blogPosts'));
console.log('所有文章:', allPosts);

// 查看私密文章
const privatePosts = allPosts.filter(p => p.visibility === 'private');
console.log('私密文章:', privatePosts);

// 查看公开文章
const publicPosts = allPosts.filter(p => p.visibility !== 'private');
console.log('公开文章:', publicPosts);
```

### 检查登录状态

```javascript
// 检查是否登录
const auth = localStorage.getItem('blogAuth');
console.log('登录状态:', auth);

// 检查认证函数
console.log('是否已登录:', isAuthenticated());
```

### 模拟未登录状态

```javascript
// 临时移除登录状态（不影响实际数据）
const auth = localStorage.getItem('blogAuth');
localStorage.removeItem('blogAuth');

// 刷新页面查看效果
location.reload();

// 恢复登录状态
// localStorage.setItem('blogAuth', auth);
```

## ⚠️ 常见问题

### Q1: 退出登录后还能看到私密文章？

**原因：**
- 浏览器缓存
- 页面没有刷新

**解决：**
```
1. 强制刷新：Ctrl+F5
2. 清除缓存：F12 → Application → Clear storage
3. 重新打开页面
```

### Q2: 登录后看不到私密文章？

**原因：**
- 文章的 `visibility` 字段不是 `private`
- 数据没有保存

**解决：**
```javascript
// 检查文章数据
const posts = JSON.parse(localStorage.getItem('blogPosts'));
const post = posts.find(p => p.id === 你的文章ID);
console.log('文章可见性:', post.visibility);

// 如果不是 private，手动修改
post.visibility = 'private';
localStorage.setItem('blogPosts', JSON.stringify(posts));
location.reload();
```

### Q3: 生成的 HTML 文件显示私密内容？

**原因：**
- 静态 HTML 文件不包含权限检查
- 文件已经包含完整内容

**解决：**
```
1. 不要为私密文章生成 HTML
2. 不要上传私密文章的 HTML 到 GitHub
3. 或者使用服务器端渲染
```

## 🛡️ 安全建议

### 1. 不要依赖前端保护

**当前实现：**
- ✅ 适合个人博客
- ✅ 防止普通访客查看
- ❌ 不能防止技术人员查看（localStorage 可见）

**如果需要真正的安全：**
- 使用服务器端验证
- 不要将私密内容存储在 localStorage
- 使用数据库存储

### 2. 私密文章的用途

**适合：**
- 草稿文章
- 待发布内容
- 个人笔记
- 测试文章

**不适合：**
- 敏感信息
- 机密内容
- 需要严格保密的内容

### 3. 最佳实践

```
✅ 使用私密标记管理草稿
✅ 发布前设置为公开
✅ 定期检查文章可见性
❌ 不要在私密文章中存储密码
❌ 不要存储个人敏感信息
```

## 📊 测试检查清单

- [ ] 创建私密文章
- [ ] 退出登录
- [ ] 首页不显示私密文章
- [ ] 直接访问显示"私密文章"提示
- [ ] 登录后可以看到私密文章
- [ ] 分类筛选正确过滤私密文章
- [ ] 后台管理页面显示所有文章
- [ ] 私密文章有 🔒 标记

## 🎯 总结

### 保护级别：

| 场景 | 未登录 | 已登录 |
|------|--------|--------|
| 首页列表 | ❌ 不显示 | ✅ 显示 |
| 文章详情 | ❌ 提示私密 | ✅ 正常显示 |
| 后台管理 | ❌ 无法访问 | ✅ 完全访问 |
| 静态 HTML | ⚠️ 包含内容 | ⚠️ 包含内容 |

### 关键点：

1. ✅ 前端有双重过滤保护
2. ✅ 直接访问会被拦截
3. ✅ 登录后正常访问
4. ⚠️ 静态 HTML 需要手动管理

---

**提示：私密文章功能已经正确实现，按照测试步骤验证即可！**
