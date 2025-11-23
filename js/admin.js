// 获取文章数据
function getPosts() {
    return JSON.parse(localStorage.getItem('blogPosts') || '[]');
}

// 保存文章数据
function savePosts(posts) {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
}

// 加载文章列表
function loadPostsList(category = 'all') {
    const posts = getPosts();
    const container = document.getElementById('admin-posts-list');
    
    // 按分类筛选
    const filteredPosts = category === 'all' 
        ? posts 
        : posts.filter(p => p.category === category);
    
    if (filteredPosts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>📭 暂无文章</p>
                <button class="btn" onclick="createNewPost()">+ 创建第一篇文章</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredPosts.map(post => {
        const visibilityIcon = post.visibility === 'private' ? '🔒' : '🌍';
        const visibilityText = post.visibility === 'private' ? '私密' : '公开';
        const visibilityClass = post.visibility === 'private' ? 'visibility-private' : 'visibility-public';
        
        // 获取统计数据
        const stats = getPostStats(post.id);
        
        return `
        <div class="admin-post-item">
            <div class="admin-post-info">
                ${post.coverImage ? `<img src="${post.coverImage}" alt="${post.title}" class="admin-post-thumb">` : '<div class="admin-post-thumb-placeholder">📄</div>'}
                <div class="admin-post-details">
                    <h3>${post.title}</h3>
                    <div class="admin-post-meta">
                        <span class="category-badge">${post.category || '未分类'}</span>
                        <span class="visibility-badge ${visibilityClass}">${visibilityIcon} ${visibilityText}</span>
                        <span>📅 ${post.date}</span>
                        <span>✍️ ${post.author || '博主'}</span>
                    </div>
                    <div class="admin-post-stats">
                        <span title="浏览次数">👁️ ${stats.views} 次浏览</span>
                    </div>
                    <p class="admin-post-excerpt">${post.excerpt}</p>
                </div>
            </div>
            <div class="admin-post-actions">
                <button class="btn-icon" onclick="viewPost(${post.id})" title="查看">
                    👁️
                </button>
                <button class="btn-icon" onclick="editPost(${post.id})" title="编辑">
                    ✏️
                </button>
                <button class="btn-icon" onclick="generateSinglePostHTML(${post.id})" title="生成 HTML">
                    📄
                </button>
                <button class="btn-icon btn-danger" onclick="deletePost(${post.id})" title="删除">
                    🗑️
                </button>
            </div>
        </div>
        `;
    }).join('');
}

// 新建文章
function createNewPost() {
    window.location.href = 'editor.html';
}

// 编辑文章
function editPost(postId) {
    window.location.href = `editor.html?id=${postId}`;
}

// 查看文章
function viewPost(postId) {
    window.location.href = `post.html?id=${postId}`;
}

// 删除文章
function deletePost(postId) {
    if (!confirm('确定要删除这篇文章吗？此操作不可恢复！')) {
        return;
    }
    
    const posts = getPosts();
    const deletedPost = posts.find(p => p.id === postId);
    const filteredPosts = posts.filter(p => p.id !== postId);
    savePosts(filteredPosts);
    
    // 同时删除该文章的评论
    const allComments = JSON.parse(localStorage.getItem('blogComments') || '{}');
    if (allComments[postId]) {
        delete allComments[postId];
        localStorage.setItem('blogComments', JSON.stringify(allComments));
    }
    
    // 重新加载统计和列表
    loadOverallStats();
    const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
    loadPostsList(activeCategory);
    
    // 提示用户
    const message = `文章《${deletedPost ? deletedPost.title : ''}》已删除！\n\n前端页面会自动同步，刷新即可看到更新。`;
    alert(message);
}

// 分类筛选
function setupCategoryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新激活状态
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 加载对应分类的文章
            const category = btn.dataset.category;
            loadPostsList(category);
        });
    });
}

// 加载总体统计
function loadOverallStats() {
    const stats = getOverallStats();
    const container = document.getElementById('overall-stats');
    
    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon">📝</div>
            <div class="stat-info">
                <div class="stat-value">${stats.totalPosts}</div>
                <div class="stat-label">总文章数</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">👁️</div>
            <div class="stat-info">
                <div class="stat-value">${stats.totalViews}</div>
                <div class="stat-label">总浏览量</div>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon">🌍</div>
            <div class="stat-info">
                <div class="stat-value">${stats.publicPosts}</div>
                <div class="stat-label">公开文章</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">🔒</div>
            <div class="stat-info">
                <div class="stat-value">${stats.privatePosts}</div>
                <div class="stat-label">私密文章</div>
            </div>
        </div>
    `;
}

// 重置初始化标记（用于测试）
function resetInitFlag() {
    if (confirm('确定要重置初始化标记吗？\n\n这将允许系统在数据为空时重新创建示例文章。')) {
        localStorage.removeItem('blogInitialized');
        alert('初始化标记已重置！\n\n如果当前没有文章，刷新前端页面将重新创建示例文章。');
    }
}

// 生成所有文章的 HTML 文件
function generateAllPostsHTML() {
    const posts = getPosts();
    
    if (posts.length === 0) {
        alert('没有文章可以生成！');
        return;
    }
    
    if (!confirm(`确定要生成 ${posts.length} 篇文章的 HTML 文件吗？\n\n文件将自动下载到您的下载文件夹。\n建议创建一个 "posts" 文件夹来存放这些文件。`)) {
        return;
    }
    
    alert('开始生成文章...\n\n请稍候，文件将陆续下载。');
    
    postGenerator.downloadAllPosts(posts);
    
    setTimeout(() => {
        alert(`✅ 已生成 ${posts.length} 篇文章！\n\n请将下载的文件放入项目的 "posts" 文件夹中。\n\n文件命名格式：post-{ID}-{标题}.html`);
    }, posts.length * 500 + 1000);
}

// 生成单篇文章的 HTML
function generateSinglePostHTML(postId) {
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        alert('文章不存在！');
        return;
    }
    
    postGenerator.downloadPost(post);
    alert(`✅ 文章《${post.title}》已生成！\n\n请将文件放入项目的 "posts" 文件夹中。`);
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 保护页面
    protectPage();
    
    loadOverallStats();
    loadPostsList();
    setupCategoryFilter();
});
