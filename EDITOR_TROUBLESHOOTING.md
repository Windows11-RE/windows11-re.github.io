# 编辑器故障排除指南

## 🔧 问题：看不到富文本编辑器

如果你在 `editor.html` 页面看不到富文本编辑器，请按以下步骤排查：

### 步骤 1：运行诊断工具

打开 `editor-diagnostic.html` 文件，这个诊断工具会自动检测：
- 浏览器环境
- CDN 连接状态
- Quill 库是否加载
- 编辑器能否正常初始化

根据诊断结果进行相应处理。

### 步骤 2：检查浏览器控制台

1. 打开 `editor.html`
2. 按 `F12` 打开开发者工具
3. 切换到 "Console"（控制台）标签
4. 查看是否有错误信息

**常见错误及解决方法：**

#### 错误 1：`Quill is not defined`
**原因：** Quill 库未加载
**解决：**
- 检查网络连接
- 尝试刷新页面（Ctrl+F5 强制刷新）
- 如果在国内，CDN 可能被墙，尝试使用 VPN

#### 错误 2：`Failed to load resource`
**原因：** CDN 资源加载失败
**解决：**
- 检查网络连接
- 尝试使用其他 CDN（见下方）
- 下载 Quill 到本地使用

#### 错误 3：`Cannot read property 'innerHTML' of null`
**原因：** 编辑器容器未找到
**解决：**
- 确保 HTML 文件完整
- 检查是否有 JavaScript 错误阻止了页面加载

### 步骤 3：测试简化版编辑器

打开 `editor-simple.html` 或 `test-quill.html`，这些是最简化的测试页面。

如果这些页面能正常显示编辑器，说明 Quill 库本身没问题，可能是 `editor.html` 的其他代码有冲突。

### 步骤 4：检查 CDN 可用性

尝试在浏览器中直接访问以下链接：

1. **jsDelivr CDN（推荐）：**
   - https://cdn.jsdelivr.net/npm/quill@1.3.6/dist/quill.js
   - https://cdn.jsdelivr.net/npm/quill@1.3.6/dist/quill.snow.css

2. **Quill 官方 CDN：**
   - https://cdn.quilljs.com/1.3.6/quill.js
   - https://cdn.quilljs.com/1.3.6/quill.snow.css

3. **unpkg CDN：**
   - https://unpkg.com/quill@1.3.6/dist/quill.js
   - https://unpkg.com/quill@1.3.6/dist/quill.snow.css

如果都无法访问，说明网络有问题。

### 步骤 5：使用本地 Quill 库

如果 CDN 都无法访问，可以下载 Quill 到本地：

1. 访问 https://github.com/quilljs/quill/releases
2. 下载最新版本的 `quill.tar.gz`
3. 解压后将 `dist` 文件夹放到项目根目录
4. 修改 `editor.html` 中的引用：

```html
<!-- 将 CDN 链接改为本地路径 -->
<link href="dist/quill.snow.css" rel="stylesheet">
<script src="dist/quill.js"></script>
```

## 🌐 更换 CDN

如果当前 CDN 不可用，可以尝试更换：

### 方法 1：修改 editor.html

找到这两行：
```html
<link href="https://cdn.jsdelivr.net/npm/quill@1.3.6/dist/quill.snow.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/quill@1.3.6/dist/quill.js"></script>
```

替换为其他 CDN：

**使用 unpkg：**
```html
<link href="https://unpkg.com/quill@1.3.6/dist/quill.snow.css" rel="stylesheet">
<script src="https://unpkg.com/quill@1.3.6/dist/quill.js"></script>
```

**使用 Quill 官方：**
```html
<link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
<script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
```

## 🔍 调试技巧

### 查看控制台日志

编辑器初始化时会输出日志：
```
页面 DOM 加载完成
准备初始化 Quill 编辑器
开始初始化 Quill 编辑器...
Quill 编辑器初始化成功！
```

如果看不到这些日志，说明 JavaScript 执行有问题。

### 手动测试 Quill

在浏览器控制台输入：
```javascript
typeof Quill
```

如果返回 `"function"`，说明 Quill 已加载。
如果返回 `"undefined"`，说明 Quill 未加载。

### 手动初始化编辑器

在控制台输入：
```javascript
const testQuill = new Quill('#editor-container', {
    theme: 'snow',
    placeholder: '测试...'
});
```

如果成功，编辑器应该会出现。

## 📱 浏览器兼容性

Quill 支持以下浏览器：
- Chrome 最新版 ✅
- Firefox 最新版 ✅
- Safari 最新版 ✅
- Edge 最新版 ✅
- IE 11 ⚠️（部分功能可能不可用）

如果使用旧版浏览器，建议升级到最新版本。

## 🆘 仍然无法解决？

如果以上方法都无法解决问题，请提供以下信息：

1. 浏览器类型和版本
2. 操作系统
3. 控制台错误信息（截图）
4. `editor-diagnostic.html` 的诊断结果
5. 网络环境（是否使用代理/VPN）

## ✅ 验证编辑器工作正常

如果编辑器正常工作，你应该能看到：

1. **工具栏**：包含格式化按钮（粗体、斜体等）
2. **编辑区域**：白色背景，可以输入文字
3. **占位符文字**："开始编写你的文章内容..."
4. **可以编辑**：点击后可以输入和格式化文字

## 🎯 快速测试清单

- [ ] 打开 `test-quill.html` - 能看到编辑器吗？
- [ ] 打开 `editor-simple.html` - 能看到编辑器吗？
- [ ] 打开 `editor-diagnostic.html` - 所有测试都通过了吗？
- [ ] 打开 `editor.html` - 能看到编辑器吗？
- [ ] 控制台有错误吗？
- [ ] 网络连接正常吗？

如果前三个都能看到编辑器，但 `editor.html` 不行，说明是页面代码的问题，而不是 Quill 的问题。

---

**提示：** 大多数情况下，问题都是由于 CDN 访问不畅导致的。使用诊断工具可以快速定位问题。
