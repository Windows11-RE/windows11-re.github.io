// GitHub 存储模块
// 使用 GitHub API 将数据存储为 JSON 文件

class GitHubStorage {
    constructor() {
        this.config = this.loadConfig();
        this.cache = {
            posts: null,
            comments: null,
            categories: null,
            analytics: null
        };
    }

    // 加载配置
    loadConfig() {
        const config = localStorage.getItem('githubConfig');
        if (config) {
            return JSON.parse(config);
        }
        return {
            owner: '',           // GitHub 用户名
            repo: '',            // 仓库名
            token: '',           // Personal Access Token
            branch: 'main',      // 分支名
            dataPath: ''         // 数据文件路径（空字符串表示根目录）
        };
    }

    // 保存配置
    saveConfig(config) {
        this.config = { ...this.config, ...config };
        localStorage.setItem('githubConfig', JSON.stringify(this.config));
    }

    // 检查是否已配置
    isConfigured() {
        return !!(this.config.owner && this.config.repo && this.config.token);
    }

    // 获取文件内容
    async getFile(filename) {
        if (!this.isConfigured()) {
            throw new Error('GitHub 未配置');
        }

        const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.dataPath}${filename}`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${this.config.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.status === 404) {
                return null; // 文件不存在
            }

            if (!response.ok) {
                throw new Error(`GitHub API 错误: ${response.status}`);
            }

            const data = await response.json();
            const content = this.base64ToUtf8(data.content); // 使用支持中文的 Base64 解码
            return {
                content: JSON.parse(content),
                sha: data.sha // 用于更新文件
            };
        } catch (error) {
            console.error('获取文件失败:', error);
            throw error;
        }
    }

    // UTF-8 字符串转 Base64（支持中文）
    utf8ToBase64(str) {
        try {
            // 使用 TextEncoder 处理 UTF-8
            const encoder = new TextEncoder();
            const uint8Array = encoder.encode(str);
            
            // 将 Uint8Array 转换为二进制字符串
            let binaryString = '';
            uint8Array.forEach(byte => {
                binaryString += String.fromCharCode(byte);
            });
            
            // Base64 编码
            return btoa(binaryString);
        } catch (error) {
            console.error('Base64 编码失败:', error);
            throw new Error('数据编码失败');
        }
    }

    // Base64 转 UTF-8 字符串（支持中文）
    base64ToUtf8(base64) {
        try {
            // Base64 解码
            const binaryString = atob(base64);
            
            // 转换为 Uint8Array
            const uint8Array = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                uint8Array[i] = binaryString.charCodeAt(i);
            }
            
            // 使用 TextDecoder 解码 UTF-8
            const decoder = new TextDecoder();
            return decoder.decode(uint8Array);
        } catch (error) {
            console.error('Base64 解码失败:', error);
            throw new Error('数据解码失败');
        }
    }

    // 保存文件
    async saveFile(filename, content, sha = null) {
        if (!this.isConfigured()) {
            throw new Error('GitHub 未配置');
        }

        const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.dataPath}${filename}`;
        
        const jsonString = JSON.stringify(content, null, 2);
        const body = {
            message: `Update ${filename}`,
            content: this.utf8ToBase64(jsonString), // 使用支持中文的 Base64 编码
            branch: this.config.branch
        };

        if (sha) {
            body.sha = sha; // 更新现有文件需要 SHA
        }

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.config.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('GitHub API 详细错误:', errorData);
                
                // 提供更详细的错误信息
                let errorMessage = errorData.message || '未知错误';
                if (errorData.errors) {
                    errorMessage += ': ' + JSON.stringify(errorData.errors);
                }
                
                throw new Error(`GitHub API 错误 (${response.status}): ${errorMessage}`);
            }

            return await response.json();
        } catch (error) {
            console.error('保存文件失败:', error);
            throw error;
        }
    }

    // 获取文章列表
    async getPosts() {
        if (this.cache.posts) {
            return this.cache.posts;
        }

        try {
            const result = await this.getFile('posts.json');
            const posts = result ? result.content : [];
            this.cache.posts = posts;
            return posts;
        } catch (error) {
            console.error('获取文章失败，使用本地缓存');
            return JSON.parse(localStorage.getItem('blogPosts') || '[]');
        }
    }

    // 保存文章列表
    async savePosts(posts) {
        try {
            const result = await this.getFile('posts.json');
            const sha = result ? result.sha : null;
            await this.saveFile('posts.json', posts, sha);
            this.cache.posts = posts;
            // 同时保存到 localStorage 作为缓存
            localStorage.setItem('blogPosts', JSON.stringify(posts));
            return true;
        } catch (error) {
            console.error('保存文章失败:', error);
            throw error;
        }
    }

    // 获取评论
    async getComments() {
        if (this.cache.comments) {
            return this.cache.comments;
        }

        try {
            const result = await this.getFile('comments.json');
            const comments = result ? result.content : {};
            this.cache.comments = comments;
            return comments;
        } catch (error) {
            console.error('获取评论失败，使用本地缓存');
            return JSON.parse(localStorage.getItem('blogComments') || '{}');
        }
    }

    // 保存评论
    async saveComments(comments) {
        try {
            const result = await this.getFile('comments.json');
            const sha = result ? result.sha : null;
            await this.saveFile('comments.json', comments, sha);
            this.cache.comments = comments;
            localStorage.setItem('blogComments', JSON.stringify(comments));
            return true;
        } catch (error) {
            console.error('保存评论失败:', error);
            throw error;
        }
    }

    // 获取分类
    async getCategories() {
        if (this.cache.categories) {
            return this.cache.categories;
        }

        try {
            const result = await this.getFile('categories.json');
            const categories = result ? result.content : ['技术', '生活', '随笔', '教程'];
            this.cache.categories = categories;
            return categories;
        } catch (error) {
            console.error('获取分类失败，使用本地缓存');
            return JSON.parse(localStorage.getItem('blogCategories') || '["技术", "生活", "随笔", "教程"]');
        }
    }

    // 保存分类
    async saveCategories(categories) {
        try {
            const result = await this.getFile('categories.json');
            const sha = result ? result.sha : null;
            await this.saveFile('categories.json', categories, sha);
            this.cache.categories = categories;
            localStorage.setItem('blogCategories', JSON.stringify(categories));
            return true;
        } catch (error) {
            console.error('保存分类失败:', error);
            throw error;
        }
    }

    // 获取统计数据
    async getAnalytics() {
        if (this.cache.analytics) {
            return this.cache.analytics;
        }

        try {
            const result = await this.getFile('analytics.json');
            const analytics = result ? result.content : {};
            this.cache.analytics = analytics;
            return analytics;
        } catch (error) {
            console.error('获取统计失败，使用本地缓存');
            return JSON.parse(localStorage.getItem('blogAnalytics') || '{}');
        }
    }

    // 保存统计数据
    async saveAnalytics(analytics) {
        try {
            const result = await this.getFile('analytics.json');
            const sha = result ? result.sha : null;
            await this.saveFile('analytics.json', analytics, sha);
            this.cache.analytics = analytics;
            localStorage.setItem('blogAnalytics', JSON.stringify(analytics));
            return true;
        } catch (error) {
            console.error('保存统计失败:', error);
            throw error;
        }
    }

    // 同步所有数据到 GitHub
    async syncAll(progressCallback = null) {
        const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const comments = JSON.parse(localStorage.getItem('blogComments') || '{}');
        const categories = JSON.parse(localStorage.getItem('blogCategories') || '[]');
        const analytics = JSON.parse(localStorage.getItem('blogAnalytics') || '{}');

        const tasks = [
            { name: '文章数据', fn: () => this.savePosts(posts) },
            { name: '评论数据', fn: () => this.saveComments(comments) },
            { name: '分类数据', fn: () => this.saveCategories(categories) },
            { name: '统计数据', fn: () => this.saveAnalytics(analytics) }
        ];

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            if (progressCallback) {
                progressCallback(task.name, i + 1, tasks.length);
            }
            await task.fn();
        }
    }

    // 从 GitHub 拉取所有数据
    async pullAll(progressCallback = null) {
        const tasks = [
            { name: '文章数据', fn: () => this.getPosts() },
            { name: '评论数据', fn: () => this.getComments() },
            { name: '分类数据', fn: () => this.getCategories() },
            { name: '统计数据', fn: () => this.getAnalytics() }
        ];

        const results = [];
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            if (progressCallback) {
                progressCallback(task.name, i + 1, tasks.length);
            }
            results.push(await task.fn());
        }

        const [posts, comments, categories, analytics] = results;

        localStorage.setItem('blogPosts', JSON.stringify(posts));
        localStorage.setItem('blogComments', JSON.stringify(comments));
        localStorage.setItem('blogCategories', JSON.stringify(categories));
        localStorage.setItem('blogAnalytics', JSON.stringify(analytics));
    }

    // 清除缓存
    clearCache() {
        this.cache = {
            posts: null,
            comments: null,
            categories: null,
            analytics: null
        };
    }
}

// 创建全局实例
const githubStorage = new GitHubStorage();
