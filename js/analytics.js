// 文章统计分析模块

const ANALYTICS_KEY = 'blogAnalytics';

// 获取所有统计数据
function getAnalytics() {
    const analytics = localStorage.getItem(ANALYTICS_KEY);
    if (!analytics) {
        return {};
    }
    return JSON.parse(analytics);
}

// 保存统计数据
function saveAnalytics(analytics) {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
}

// 获取单篇文章的统计数据
function getPostAnalytics(postId) {
    const analytics = getAnalytics();
    if (!analytics[postId]) {
        analytics[postId] = {
            views: 0,
            lastViewed: null,
            firstViewed: null,
            viewHistory: []
        };
    }
    return analytics[postId];
}

// 记录文章浏览
function recordPostView(postId) {
    const analytics = getAnalytics();
    
    if (!analytics[postId]) {
        analytics[postId] = {
            views: 0,
            lastViewed: null,
            firstViewed: null,
            viewHistory: []
        };
    }
    
    const now = new Date().toISOString();
    
    // 增加浏览次数
    analytics[postId].views++;
    analytics[postId].lastViewed = now;
    
    // 记录首次浏览时间
    if (!analytics[postId].firstViewed) {
        analytics[postId].firstViewed = now;
    }
    
    // 记录浏览历史（最多保留最近100次）
    analytics[postId].viewHistory.push(now);
    if (analytics[postId].viewHistory.length > 100) {
        analytics[postId].viewHistory.shift();
    }
    
    saveAnalytics(analytics);
}

// 获取文章评论数
function getPostCommentCount(postId) {
    const allComments = JSON.parse(localStorage.getItem('blogComments') || '{}');
    const postComments = allComments[postId] || [];
    return postComments.length;
}

// 获取文章完整统计信息
function getPostStats(postId) {
    const analytics = getPostAnalytics(postId);
    const commentCount = getPostCommentCount(postId);
    
    // 获取文章信息
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const post = posts.find(p => p.id === postId);
    
    return {
        postId: postId,
        title: post ? post.title : '未知',
        views: analytics.views,
        comments: commentCount,
        firstViewed: analytics.firstViewed,
        lastViewed: analytics.lastViewed,
        createdAt: post ? post.createdAt : null,
        updatedAt: post ? post.updatedAt : null,
        category: post ? post.category : '未分类',
        visibility: post ? post.visibility : 'public'
    };
}

// 获取所有文章的统计概览
function getAllPostsStats() {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const analytics = getAnalytics();
    
    return posts.map(post => {
        const postAnalytics = analytics[post.id] || { views: 0 };
        const commentCount = getPostCommentCount(post.id);
        
        return {
            id: post.id,
            title: post.title,
            category: post.category,
            date: post.date,
            views: postAnalytics.views || 0,
            comments: commentCount,
            lastViewed: postAnalytics.lastViewed
        };
    });
}

// 获取热门文章（按浏览量排序）
function getPopularPosts(limit = 5) {
    const stats = getAllPostsStats();
    return stats
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
}

// 获取最近浏览的文章
function getRecentlyViewedPosts(limit = 5) {
    const stats = getAllPostsStats();
    return stats
        .filter(s => s.lastViewed)
        .sort((a, b) => new Date(b.lastViewed) - new Date(a.lastViewed))
        .slice(0, limit);
}

// 获取总体统计
function getOverallStats() {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const analytics = getAnalytics();
    const allComments = JSON.parse(localStorage.getItem('blogComments') || '{}');
    
    let totalViews = 0;
    let totalComments = 0;
    
    // 计算总浏览量
    Object.values(analytics).forEach(stat => {
        totalViews += stat.views || 0;
    });
    
    // 计算总评论数
    Object.values(allComments).forEach(comments => {
        totalComments += comments.length;
    });
    
    return {
        totalPosts: posts.length,
        totalViews: totalViews,
        totalComments: totalComments,
        publicPosts: posts.filter(p => p.visibility !== 'private').length,
        privatePosts: posts.filter(p => p.visibility === 'private').length
    };
}

// 格式化日期时间
function formatDateTime(isoString) {
    if (!isoString) return '从未';
    
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;
    
    // 小于1分钟
    if (diff < 60000) {
        return '刚刚';
    }
    
    // 小于1小时
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}分钟前`;
    }
    
    // 小于24小时
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}小时前`;
    }
    
    // 小于7天
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days}天前`;
    }
    
    // 格式化为日期
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}
