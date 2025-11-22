// 数据备份和恢复模块

// 导出所有数据
function exportAllData() {
    const data = {
        posts: localStorage.getItem('blogPosts'),
        comments: localStorage.getItem('blogComments'),
        categories: localStorage.getItem('blogCategories'),
        analytics: localStorage.getItem('blogAnalytics'),
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `blog-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    alert('数据导出成功！');
}

// 导入数据
function importData(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            if (confirm('导入数据将覆盖现有数据，确定继续吗？')) {
                if (data.posts) localStorage.setItem('blogPosts', data.posts);
                if (data.comments) localStorage.setItem('blogComments', data.comments);
                if (data.categories) localStorage.setItem('blogCategories', data.categories);
                if (data.analytics) localStorage.setItem('blogAnalytics', data.analytics);
                
                alert('数据导入成功！页面将刷新。');
                window.location.reload();
            }
        } catch (error) {
            alert('数据格式错误，导入失败！');
            console.error(error);
        }
    };
    
    reader.readAsText(file);
}

// 清空所有数据
function clearAllData() {
    if (confirm('确定要清空所有数据吗？此操作不可恢复！\n\n建议先导出备份。')) {
        if (confirm('再次确认：真的要删除所有文章、评论和统计数据吗？')) {
            localStorage.removeItem('blogPosts');
            localStorage.removeItem('blogComments');
            localStorage.removeItem('blogCategories');
            localStorage.removeItem('blogAnalytics');
            
            alert('所有数据已清空！页面将刷新。');
            window.location.reload();
        }
    }
}
