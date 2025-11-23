// Quill 编辑器实例
let quillEditor = null;

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

// 初始化 Quill 编辑器
function initQuillEditor() {
    console.log('开始初始化 Quill 编辑器...');
    
    // 检查 Quill 是否已加载
    if (typeof Quill === 'undefined') {
        console.error('Quill 库未加载！');
        alert('编辑器加载失败，请刷新页面重试。如果问题持续，请检查网络连接。');
        return;
    }
    
    // 检查容器是否存在
    const container = document.querySelector('#editor-container');
    if (!container) {
        console.error('编辑器容器 #editor-container 不存在！');
        return;
    }
    
    const toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
    ];

    try {
        quillEditor = new Quill('#editor-container', {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions
            },
            placeholder: '开始编写你的文章内容...'
        });

        // 监听内容变化，同步到隐藏的 textarea
        quillEditor.on('text-change', function() {
            const html = quillEditor.root.innerHTML;
            document.getElementById('post-content').value = html;
        });
        
        console.log('Quill 编辑器初始化成功！', quillEditor);
    } catch (error) {
        console.error('Quill 编辑器初始化失败：', error);
        alert('编辑器初始化失败：' + error.message);
    }
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
            
            // 加载内容到 Quill 编辑器
            if (quillEditor && post.content) {
                quillEditor.root.innerHTML = post.content;
            }
            
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
    
    // 从 Quill 编辑器获取内容
    const content = quillEditor ? quillEditor.root.innerHTML.trim() : '';
    
    if (!title || !category || !excerpt || !content || content === '<p><br></p>') {
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
    
    // 从 Quill 编辑器获取 HTML 内容
    const content = quillEditor ? quillEditor.root.innerHTML : '';
    
    const now = new Date().toLocaleDateString('zh-CN');
    
    const previewContent = document.getElementById('preview-content');
    
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
            <div class="post-content">
                ${content || '<p><em>内容为空</em></p>'}
            </div>
        </article>
    `;
    
    document.getElementById('preview-modal').classList.add('active');
}

// 关闭预览
function closePreview() {
    document.getElementById('preview-modal').classList.remove('active');
}

// 这个函数已不再需要，因为 Quill 编辑器有自己的工具栏

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
    console.log('页面 DOM 加载完成');
    
    // 保护页面
    protectPage();
    
    // 初始化 Quill 编辑器
    console.log('准备初始化 Quill 编辑器');
    initQuillEditor();
    
    // 加载分类到下拉框
    loadCategoriesToSelect();
    
    // 加载文章数据（需要在编辑器初始化后）
    setTimeout(() => {
        console.log('加载文章数据到编辑器');
        loadPostToEditor();
    }, 100);
    
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
