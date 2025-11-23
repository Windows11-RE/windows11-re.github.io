// 检查是否已登录
function isAuthenticated() {
    const auth = localStorage.getItem('blogAuth');
    if (!auth) return false;
    try {
        const authData = JSON.parse(auth);
        return authData.isAuthenticated === true;
    } catch (e) {
        return false;
    }
}

// 获取文章数据（仅公开文章，除非已登录）
function getPosts() {
    const allPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    // 检查是否已经初始化过
    const hasInitialized = localStorage.getItem('blogInitialized');
    
    // 只在第一次访问且没有数据时初始化示例数据
    if (allPosts.length === 0 && !hasInitialized) {
        const defaultPosts = [
            {
                id: 1,
                title: "自我介绍",
                date: "2025-11-22",
                author: "SYSTEM_Win11_RE",
                category: "随笔",
                visibility: "public",
                excerpt: "欢迎来到我的个人博客！这是关于我的自我介绍。",
                coverImage: "https://picsum.photos/800/400?random=1",
                content: `# 自我介绍

欢迎来到我的个人博客！以下是自我介绍。

## 我是谁

写博客是一个很好的学习和分享方式。通过写作，我可以：

- 整理和巩固自己的知识
- 与他人分享经验和见解
- 记录自己的成长历程
- 结识志同道合的朋友

## 博客内容

在这个博客中，我将分享：

- 前端开发技术和经验
- 项目开发心得
- 学习笔记和总结
- 生活中的思考和感悟

希望我的分享能对你有所帮助。如果你有任何问题或建议，欢迎在评论区留言！`
            },
            {
                id: 2,
                title: "JavaScript 异步编程指南",
                date: "2025-11-20",
                author: "博主",
                category: "技术",
                visibility: "public",
                excerpt: "深入理解 JavaScript 中的异步编程，包括回调函数、Promise 和 async/await 的使用方法。",
                coverImage: "https://picsum.photos/800/400?random=2",
                content: `# JavaScript 异步编程指南

JavaScript 的异步编程是前端开发中非常重要的概念。本文将详细介绍异步编程的三种主要方式。

## 1. 回调函数（Callback）

回调函数是最基础的异步处理方式：

\`\`\`javascript
function fetchData(callback) {
    setTimeout(() => {
        callback('数据加载完成');
    }, 1000);
}

fetchData((data) => {
    console.log(data);
});
\`\`\`

## 2. Promise

Promise 提供了更优雅的异步处理方式。

## 3. Async/Await

Async/Await 是最现代的异步编程方式。`
            },
            {
                id: 3,
                title: "CSS Grid 布局实战",
                date: "2025-11-18",
                author: "博主",
                category: "教程",
                visibility: "public",
                excerpt: "通过实际案例学习 CSS Grid 布局系统，掌握现代网页布局的强大工具。",
                coverImage: "https://picsum.photos/800/400?random=3",
                content: `# CSS Grid 布局实战

CSS Grid 是一个强大的二维布局系统，让网页布局变得更加简单和灵活。`
            },
            {
                id: 4,
                title: "如何提高代码质量",
                date: "2025-11-15",
                author: "博主",
                category: "技术",
                visibility: "public",
                excerpt: "分享一些提高代码质量的实用技巧，包括代码规范、测试、重构等方面的经验。",
                coverImage: "https://picsum.photos/800/400?random=4",
                content: `# 如何提高代码质量

高质量的代码不仅易于维护，还能提高开发效率。以下是一些实用的建议。`
            }
        ];
        localStorage.setItem('blogPosts', JSON.stringify(defaultPosts));
        localStorage.setItem('blogInitialized', 'true'); // 标记已初始化
        
        // 如果未登录，只返回公开文章
        if (!isAuthenticated()) {
            return defaultPosts.filter(p => p.visibility !== 'private');
        }
        return defaultPosts;
    }
    
    // 如果未登录，只返回公开文章
    if (!isAuthenticated()) {
        return allPosts.filter(p => p.visibility !== 'private');
    }
    
    return allPosts;
}

// 加载文章列表
function loadPosts(category = 'all') {
    const postsContainer = document.getElementById('posts-container');
    
    if (!postsContainer) return;
    
    const posts = getPosts();
    const filteredPosts = category === 'all' 
        ? posts 
        : posts.filter(p => p.category === category);
    
    if (filteredPosts.length === 0) {
        postsContainer.innerHTML = '<p class="empty-message">暂无文章</p>';
        return;
    }
    
    postsContainer.innerHTML = filteredPosts.map(post => `
        <article class="post-card" onclick="viewPost(${post.id})">
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

// 设置分类筛选
function setupCategoryFilter() {
    const filterBtns = document.querySelectorAll('.category-filter .filter-btn');
    
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            loadPosts(category);
        });
    });
}

// 查看文章详情
function viewPost(postId) {
    window.location.href = `post.html?id=${postId}`;
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    setupCategoryFilter();
});
