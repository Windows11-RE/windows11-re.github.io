// 静态文章加载器 - 从 GitHub 仓库读取真实的 HTML 文件
// 不再依赖 localStorage

// 注：已移除认证功能，所有文章默认公开显示

// 从 posts/index.json 加载文章列表
async function loadPostsFromJSON() {
    try {
        const response = await fetch('posts/index.json');
        if (!response.ok) {
            console.warn('posts/index.json 不存在，返回空列表');
            return [];
        }
        const data = await response.json();
        return data.posts || [];
    } catch (error) {
        console.error('加载文章列表失败:', error);
        return [];
    }
}

// 加载文章列表到首页
async function loadStaticPosts(category = 'all') {
    const postsContainer = document.getElementById('posts-container');
    
    if (!postsContainer) return;
    
    // 显示加载中
    postsContainer.innerHTML = '<p class="empty-message">正在加载文章...</p>';
    
    // 从 JSON 文件加载文章列表
    const allPosts = await loadPostsFromJSON();
    
    if (allPosts.length === 0) {
        postsContainer.innerHTML = '<p class="empty-message">暂无文章</p>';
        return;
    }
    
    // 按分类筛选
    const filteredPosts = category === 'all' 
        ? allPosts 
        : allPosts.filter(p => p.category === category);
    
    // 过滤私密文章（只显示公开文章）
    const publicPosts = filteredPosts.filter(p => p.visibility !== 'private');
    
    if (publicPosts.length === 0) {
        postsContainer.innerHTML = '<p class="empty-message">暂无文章</p>';
        return;
    }
    
    // 渲染文章卡片
    postsContainer.innerHTML = publicPosts.map(post => `
        <article class="post-card" onclick="viewStaticPost('${post.url}')">
            ${post.coverImage ? `<img src="${post.coverImage}" alt="${post.title}" class="post-card-cover">` : ''}
            <div class="post-card-content">
                <span class="category-badge">${post.category || '未分类'}</span>
                <h3>${post.title}</h3>
                <div class="post-meta">📅 ${post.date}</div>
                <p class="post-excerpt">${post.excerpt}</p>
            </div>
        </article>
    `).join('');
}

// 查看文章（跳转到静态 HTML）
function viewStaticPost(url) {
    window.location.href = url;
}

// 设置分类筛选
function setupStaticCategoryFilter() {
    const filterBtns = document.querySelectorAll('.category-filter .filter-btn');
    
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            loadStaticPosts(category);
        });
    });
}

// 页面加载完成后执行
if (document.getElementById('posts-container')) {
    document.addEventListener('DOMContentLoaded', () => {
        loadStaticPosts();
        setupStaticCategoryFilter();
    });
}
