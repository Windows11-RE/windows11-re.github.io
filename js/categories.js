// 分类管理模块

const CATEGORIES_KEY = 'blogCategories';

// 获取所有分类
function getCategories() {
    const categories = localStorage.getItem(CATEGORIES_KEY);
    if (!categories) {
        // 默认分类
        const defaultCategories = ['技术', '生活', '随笔', '教程'];
        saveCategories(defaultCategories);
        return defaultCategories;
    }
    return JSON.parse(categories);
}

// 保存分类
function saveCategories(categories) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

// 添加新分类
function addCategory(categoryName) {
    const categories = getCategories();
    const trimmedName = categoryName.trim();
    
    if (!trimmedName) {
        return { success: false, message: '分类名称不能为空！' };
    }
    
    if (categories.includes(trimmedName)) {
        return { success: false, message: '该分类已存在！' };
    }
    
    categories.push(trimmedName);
    saveCategories(categories);
    return { success: true, message: '分类添加成功！' };
}

// 删除分类
function deleteCategory(categoryName) {
    const categories = getCategories();
    const index = categories.indexOf(categoryName);
    
    if (index === -1) {
        return { success: false, message: '分类不存在！' };
    }
    
    // 检查是否有文章使用该分类
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const hasPostsInCategory = posts.some(post => post.category === categoryName);
    
    if (hasPostsInCategory) {
        return { success: false, message: '该分类下还有文章，无法删除！请先移动或删除相关文章。' };
    }
    
    categories.splice(index, 1);
    saveCategories(categories);
    return { success: true, message: '分类删除成功！' };
}

// 重命名分类
function renameCategory(oldName, newName) {
    const categories = getCategories();
    const trimmedNewName = newName.trim();
    
    if (!trimmedNewName) {
        return { success: false, message: '新分类名称不能为空！' };
    }
    
    if (oldName === trimmedNewName) {
        return { success: false, message: '新旧分类名称相同！' };
    }
    
    if (categories.includes(trimmedNewName)) {
        return { success: false, message: '新分类名称已存在！' };
    }
    
    const index = categories.indexOf(oldName);
    if (index === -1) {
        return { success: false, message: '原分类不存在！' };
    }
    
    // 更新分类列表
    categories[index] = trimmedNewName;
    saveCategories(categories);
    
    // 更新所有使用该分类的文章
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    let updatedCount = 0;
    posts.forEach(post => {
        if (post.category === oldName) {
            post.category = trimmedNewName;
            updatedCount++;
        }
    });
    
    if (updatedCount > 0) {
        localStorage.setItem('blogPosts', JSON.stringify(posts));
    }
    
    return { 
        success: true, 
        message: `分类重命名成功！已更新 ${updatedCount} 篇文章。` 
    };
}

// 获取分类统计信息
function getCategoryStats() {
    const categories = getCategories();
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    return categories.map(category => {
        const count = posts.filter(post => post.category === category).length;
        return { name: category, count };
    });
}
