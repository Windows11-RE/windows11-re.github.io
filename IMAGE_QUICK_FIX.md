# 🚨 图片存储问题快速修复

## 错误信息
```
Failed to execute 'setItem' on 'Storage': Setting the value of 'articles' exceeded the quota.
```

## ⚡ 快速解决（3 步）

### 1️⃣ 使用图床（推荐）
不要直接插入图片，而是：
1. 上传图片到 https://sm.ms
2. 复制图片链接
3. 在编辑器中插入链接

### 2️⃣ 压缩图片
1. 打开 `test-image-compression.html`
2. 上传图片
3. 下载压缩后的图片
4. 使用压缩后的图片

### 3️⃣ 清理空间
在控制台（F12）运行：
```javascript
// 查看存储使用情况
let total = 0;
for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length;
    }
}
console.log('已使用：', (total / 1024 / 1024).toFixed(2), 'MB / 5 MB');
```

## 🎯 最佳实践

### ✅ 推荐
- 使用图床服务（Imgur, SM.MS）
- 图片压缩到 < 200KB
- 定期清理旧文章

### ❌ 避免
- 直接插入 > 1MB 的图片
- 在一篇文章中插入大量图片
- 忽略存储空间警告

## 📚 详细文档
- `IMAGE_STORAGE_GUIDE.md` - 完整解决方案
- `ARTICLE_MANAGER_DEBUG.md` - 调试指南
- `test-image-compression.html` - 压缩测试工具

## 💡 一句话总结
**用图床，别用 base64！**
