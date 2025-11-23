// 获取文章数据
function getPosts() {
    return JSON.parse(localStorage.getItem('blogPosts') || '[]');
}

// 保存文章数据
function savePosts(posts) {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
}

// 获取 URL 参数
function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 加载文章数据到编辑器
function loadPostToEditor() {
    const postId = getUrlParam('id');
    
    if (postId) {
        const posts = getPosts();
        const post = posts.find(p => p.id === parseInt(postId));
        
        if (post) {
            document.getElementById('editor-title').textContent = '✍️ 编辑文章';
            document.getElementById('post-title').value = post.title;
            document.getElementById('post-category').value = post.category || '技术';
            document.getElementById('post-author').value = post.author || '博主';
            document.getElementById('post-visibility').value = post.visibility || 'public';
            document.getElementById('post-excerpt').value = post.excerpt;
            document.getElementById('post-cover').value = post.coverImage || '';
            document.getElementById('post-content').value = post.content;
            
            // 显示封面预览
            if (post.coverImage) {
                showCoverPreview(post.coverImage);
            }
            
            // 显示统计按钮
            document.getElementById('stats-btn').style.display = 'inline-block';
        }
    } else {
        document.getElementById('editor-title').textContent = '✍️ 新建文章';
        document.getElementById('post-visibility').value = 'public';
        document.getElementById('stats-btn').style.display = 'none';
    }
}

// 保存文章
function savePost() {
    const postId = getUrlParam('id');
    const title = document.getElementById('post-title').value.trim();
    const category = document.getElementById('post-category').value;
    const author = document.getElementById('post-author').value.trim();
    const visibility = document.getElementById('post-visibility').value;
    const excerpt = document.getElementById('post-excerpt').value.trim();
    const coverImage = document.getElementById('post-cover').value.trim();
    const content = document.getElementById('post-content').value.trim();
    
    if (!title || !category || !excerpt || !content) {
        alert('请填写所有必填项！');
        return;
    }
    
    const posts = getPosts();
    const now = new Date();
    const dateStr = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '-');
    
    if (postId) {
        // 编辑现有文章
        const index = posts.findIndex(p => p.id === parseInt(postId));
        if (index !== -1) {
            posts[index] = {
                ...posts[index],
                title,
                category,
                author,
                visibility,
                excerpt,
                coverImage,
                content,
                updatedAt: now.toISOString()
            };
        }
    } else {
        // 新建文章
        const newPost = {
            id: Date.now(),
            title,
            category,
            author,
            visibility,
            excerpt,
            coverImage,
            content,
            date: dateStr,
            createdAt: now.toISOString()
        };
        posts.unshift(newPost);
    }
    
    savePosts(posts);
    alert('文章保存成功！');
    window.location.href = 'admin.html';
}

// 预览文章
function previewPost() {
    const title = document.getElementById('post-title').value.trim();
    const author = document.getElementById('post-author').value.trim();
    const category = document.getElementById('post-category').value;
    const coverImage = document.getElementById('post-cover').value.trim();
    const content = document.getElementById('post-content').value.trim();
    
    const now = new Date().toLocaleDateString('zh-CN');
    
    const previewContent = document.getElementById('preview-content');
    const renderedContent = marked.parse(content || '*内容为空*');
    
    previewContent.innerHTML = `
        <article class="post-detail">
            <header class="post-header">
                <h1>${title || '未命名文章'}</h1>
                <div class="post-meta">
                    <span>📅 ${now}</span>
                    <span>✍️ ${author || '博主'}</span>
                    <span>📁 ${category || '未分类'}</span>
                </div>
            </header>
            ${coverImage ? `<img src="${coverImage}" alt="${title}" class="post-cover">` : ''}
            <div class="post-content markdown-content">
                ${renderedContent}
            </div>
        </article>
    `;
    
    document.getElementById('preview-modal').classList.add('active');
}

// 关闭预览
function closePreview() {
    document.getElementById('preview-modal').classList.remove('active');
}

// 插入格式
function insertFormat(type) {
    const textarea = document.getElementById('post-content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let replacement = '';
    let cursorOffset = 0;
    
    switch (type) {
        case 'bold':
            replacement = `**${selectedText || '粗体文本'}**`;
            cursorOffset = selectedText ? replacement.length : -2;
            break;
        case 'italic':
            replacement = `*${selectedText || '斜体文本'}*`;
            cursorOffset = selectedText ? replacement.length : -1;
            break;
        case 'heading':
            replacement = `### ${selectedText || '标题'}`;
            cursorOffset = replacement.length;
            break;
        case 'code':
            if (selectedText.includes('\n')) {
                replacement = `\`\`\`\n${selectedText || '代码块'}\n\`\`\``;
            } else {
                replacement = `\`${selectedText || '代码'}\``;
            }
            cursorOffset = replacement.length;
            break;
        case 'link':
            const url = prompt('请输入链接地址:', 'https://');
            if (url) {
                replacement = `[${selectedText || '链接文本'}](${url})`;
                cursorOffset = replacement.length;
            }
            break;
        case 'image':
            // 提供两种方式：URL 或本地上传
            const choice = confirm('点击"确定"输入图片URL\n点击"取消"上传本地图片');
            
            if (choice) {
                // 输入 URL
                const imgUrl = prompt('请输入图片 URL:', 'https://');
                if (imgUrl && imgUrl !== 'https://') {
                    const imgMarkdown = `![${selectedText || '图片'}](${imgUrl})`;
                    textarea.value = textarea.value.substring(0, start) + imgMarkdown + textarea.value.substring(end);
                    textarea.selectionStart = textarea.selectionEnd = start + imgMarkdown.length;
                    textarea.focus();
                    textarea.dispatchEvent(new Event('input'));
                }
            } else {
                // 上传本地图片
                alert('提示：本地图片会转换为 Base64 编码，建议使用图床服务（如 imgur.com）以获得更好的性能。\n\n推荐图床：\n- https://imgur.com\n- https://sm.ms\n- https://postimages.org');
                
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                fileInput.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        if (file.size > 500 * 1024) {
                            alert('警告：图片大小超过 500KB，建议压缩后再上传，或使用图床服务。\n\n大图片会导致：\n- 编辑器卡顿\n- 保存缓慢\n- 页面加载慢');
                            if (!confirm('是否继续上传？')) {
                                return;
                            }
                        }
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const base64Image = event.target.result;
                            const imgMarkdown = `![${selectedText || file.name}](${base64Image})`;
                            textarea.value = textarea.value.substring(0, start) + imgMarkdown + textarea.value.substring(end);
                            textarea.selectionStart = textarea.selectionEnd = start + imgMarkdown.length;
                            textarea.focus();
                            textarea.dispatchEvent(new Event('input'));
                        };
                        reader.readAsDataURL(file);
                    }
                };
                fileInput.click();
            }
            return;
        case 'list':
            const lines = selectedText ? selectedText.split('\n') : ['列表项 1', '列表项 2'];
            replacement = lines.map(line => `- ${line}`).join('\n');
            cursorOffset = replacement.length;
            break;
        case 'quote':
            replacement = `> ${selectedText || '引用内容'}`;
            cursorOffset = replacement.length;
            break;
    }
    
    if (replacement) {
        textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + cursorOffset;
        textarea.focus();
    }
}

// 处理封面图片上传
function handleCoverImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件！');
        return;
    }
    
    // 检查文件大小（限制5MB）
    if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过 5MB！');
        return;
    }
    
    // 读取文件并转换为 Base64
    const reader = new FileReader();
    reader.onload = (e) => {
        const base64Image = e.target.result;
        document.getElementById('post-cover').value = base64Image;
        showCoverPreview(base64Image);
    };
    reader.readAsDataURL(file);
}

// 显示封面预览
function showCoverPreview(imageUrl) {
    const preview = document.getElementById('cover-preview');
    if (imageUrl) {
        preview.innerHTML = `<img src="${imageUrl}" alt="封面预览">`;
        preview.style.display = 'block';
    } else {
        preview.innerHTML = '';
        preview.style.display = 'none';
    }
}

// 输入封面 URL
function inputCoverUrl() {
    const url = prompt('请输入图片 URL:', 'https://');
    if (url && url !== 'https://') {
        document.getElementById('post-cover').value = url;
        showCoverPreview(url);
    }
}

// 清除封面图片
function clearCoverImage() {
    document.getElementById('post-cover').value = '';
    document.getElementById('cover-file-input').value = '';
    showCoverPreview('');
}

// 加载分类到下拉框
function loadCategoriesToSelect() {
    const categories = getCategories();
    const select = document.getElementById('post-category');
    const currentValue = select.value;
    
    // 清空现有选项（保留第一个"选择分类"）
    select.innerHTML = '<option value="">选择分类</option>';
    
    // 添加所有分类
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
    
    // 恢复之前选中的值
    if (currentValue && categories.includes(currentValue)) {
        select.value = currentValue;
    }
}

// 打开分类管理器
function openCategoryManager() {
    loadCategoryList();
    document.getElementById('category-modal').classList.add('active');
}

// 关闭分类管理器
function closeCategoryManager() {
    document.getElementById('category-modal').classList.remove('active');
    document.getElementById('new-category-name').value = '';
    loadCategoriesToSelect(); // 重新加载分类下拉框
}

// 加载分类列表
function loadCategoryList() {
    const stats = getCategoryStats();
    const container = document.getElementById('category-list');
    
    if (stats.length === 0) {
        container.innerHTML = '<p class="empty-message">暂无分类</p>';
        return;
    }
    
    container.innerHTML = stats.map(stat => `
        <div class="category-item">
            <div class="category-info">
                <span class="category-name">${stat.name}</span>
                <span class="category-count">${stat.count} 篇文章</span>
            </div>
            <div class="category-actions">
                <button class="btn-icon-small" onclick="renameCategoryPrompt('${stat.name}')" title="重命名">
                    ✏️
                </button>
                <button class="btn-icon-small btn-danger" onclick="deleteCategoryPrompt('${stat.name}')" title="删除">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
}

// 添加新分类
function addNewCategory() {
    const input = document.getElementById('new-category-name');
    const categoryName = input.value.trim();
    
    if (!categoryName) {
        alert('请输入分类名称！');
        return;
    }
    
    const result = addCategory(categoryName);
    alert(result.message);
    
    if (result.success) {
        input.value = '';
        loadCategoryList();
    }
}

// 重命名分类提示
function renameCategoryPrompt(oldName) {
    const newName = prompt(`重命名分类 "${oldName}"`, oldName);
    
    if (newName === null) return; // 用户取消
    
    const result = renameCategory(oldName, newName);
    alert(result.message);
    
    if (result.success) {
        loadCategoryList();
    }
}

// 删除分类提示
function deleteCategoryPrompt(categoryName) {
    if (!confirm(`确定要删除分类 "${categoryName}" 吗？\n\n注意：如果该分类下有文章，将无法删除。`)) {
        return;
    }
    
    const result = deleteCategory(categoryName);
    alert(result.message);
    
    if (result.success) {
        loadCategoryList();
    }
}

// 显示文章统计
function showPostStats() {
    const postId = getUrlParam('id');
    if (!postId) {
        alert('请先保存文章！');
        return;
    }
    
    const stats = getPostStats(parseInt(postId));
    const statsContent = document.getElementById('stats-content');
    
    statsContent.innerHTML = `
        <div class="stats-overview">
            <h4>📈 ${stats.title}</h4>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">👁️</div>
                    <div class="stat-info">
                        <div class="stat-value">${stats.views}</div>
                        <div class="stat-label">浏览次数</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">📁</div>
                    <div class="stat-info">
                        <div class="stat-value">${stats.category}</div>
                        <div class="stat-label">分类</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">${stats.visibility === 'public' ? '🌍' : '🔒'}</div>
                    <div class="stat-info">
                        <div class="stat-value">${stats.visibility === 'public' ? '公开' : '私密'}</div>
                        <div class="stat-label">可见性</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="stats-details">
            <h4>📅 时间信息</h4>
            <div class="stats-timeline">
                <div class="timeline-item">
                    <span class="timeline-label">创建时间：</span>
                    <span class="timeline-value">${formatDateTime(stats.createdAt)}</span>
                </div>
                <div class="timeline-item">
                    <span class="timeline-label">最后更新：</span>
                    <span class="timeline-value">${formatDateTime(stats.updatedAt)}</span>
                </div>
                <div class="timeline-item">
                    <span class="timeline-label">首次浏览：</span>
                    <span class="timeline-value">${formatDateTime(stats.firstViewed)}</span>
                </div>
                <div class="timeline-item">
                    <span class="timeline-label">最近浏览：</span>
                    <span class="timeline-value">${formatDateTime(stats.lastViewed)}</span>
                </div>
            </div>
        </div>
        
        <div class="stats-actions">
            <button class="btn btn-secondary" onclick="viewPostInFrontend(${postId})">
                🔗 前台查看
            </button>
        </div>
    `;
    
    document.getElementById('stats-modal').classList.add('active');
}

// 关闭统计模态框
function closeStatsModal() {
    document.getElementById('stats-modal').classList.remove('active');
}

// 在前台查看文章
function viewPostInFrontend(postId) {
    window.open(`post.html?id=${postId}`, '_blank');
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 保护页面
    protectPage();
    
    // 加载分类到下拉框
    loadCategoriesToSelect();
    
    loadPostToEditor();
    
    // 点击模态框背景关闭
    document.getElementById('preview-modal').addEventListener('click', (e) => {
        if (e.target.id === 'preview-modal') {
            closePreview();
        }
    });
    
    document.getElementById('category-modal').addEventListener('click', (e) => {
        if (e.target.id === 'category-modal') {
            closeCategoryManager();
        }
    });
    
    document.getElementById('stats-modal').addEventListener('click', (e) => {
        if (e.target.id === 'stats-modal') {
            closeStatsModal();
        }
    });
    
    // 新分类输入框回车添加
    document.getElementById('new-category-name').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewCategory();
        }
    });
});
