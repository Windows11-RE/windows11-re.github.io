// 文章 HTML 生成器
// 为每篇文章生成独立的 HTML 文件

class PostGenerator {
    constructor() {
        this.template = this.getTemplate();
    }

    // 获取文章页面模板
    getTemplate() {
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}} - 我的个人博客</title>
    <link rel="stylesheet" href="../css/style.css">
    <meta name="description" content="{{EXCERPT}}">
    <meta name="keywords" content="{{CATEGORY}}, 博客, {{TITLE}}">
</head>
<body>
    <header>
        <nav class="container">
            <h1 class="logo">我的博客</h1>
            <ul class="nav-links">
                <li><a href="../index.html">首页</a></li>
                <li><a href="../about.html">关于</a></li>
            </ul>
        </nav>
    </header>

    <main class="container">
        <article class="post-detail">
            <header class="post-header">
                <h1>{{TITLE}}</h1>
                <div class="post-meta">
                    <span>📅 {{DATE}}</span>
                    <span>✍️ {{AUTHOR}}</span>
                    <span>📁 {{CATEGORY}}</span>
                </div>
            </header>
            {{COVER_IMAGE}}
            <div class="post-content markdown-content">
                {{CONTENT}}
            </div>
        </article>
        
        <div class="post-navigation">
            <a href="../index.html" class="back-link">← 返回首页</a>
        </div>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2025 我的博客. 保留所有权利.</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="../js/analytics.js"></script>
    <script>
        // 记录浏览
        recordPostView({{POST_ID}});
    </script>
</body>
</html>`;
    }

    // 生成单篇文章的 HTML
    generatePostHTML(post) {
        let html = this.template;
        
        // 替换变量
        html = html.replace(/{{TITLE}}/g, this.escapeHtml(post.title));
        html = html.replace(/{{EXCERPT}}/g, this.escapeHtml(post.excerpt));
        html = html.replace(/{{CATEGORY}}/g, this.escapeHtml(post.category || '未分类'));
        html = html.replace(/{{DATE}}/g, post.date);
        html = html.replace(/{{AUTHOR}}/g, this.escapeHtml(post.author || '博主'));
        html = html.replace(/{{POST_ID}}/g, post.id);
        
        // 处理封面图
        const coverImage = post.coverImage 
            ? `<img src="${post.coverImage}" alt="${this.escapeHtml(post.title)}" class="post-cover">`
            : '';
        html = html.replace(/{{COVER_IMAGE}}/g, coverImage);
        
        // 处理内容（Markdown 转 HTML）
        const renderedContent = marked.parse(post.content || '');
        html = html.replace(/{{CONTENT}}/g, renderedContent);
        
        return html;
    }

    // 生成文件名
    generateFilename(post) {
        // 使用文章 ID 和标题生成文件名
        const slug = this.slugify(post.title);
        return `post-${post.id}-${slug}.html`;
    }

    // 转换标题为 URL 友好的格式
    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .substring(0, 50);
    }

    // HTML 转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 下载单篇文章
    downloadPost(post) {
        const html = this.generatePostHTML(post);
        const filename = this.generateFilename(post);
        
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // 下载所有文章
    downloadAllPosts(posts) {
        posts.forEach((post, index) => {
            setTimeout(() => {
                this.downloadPost(post);
            }, index * 500); // 延迟下载，避免浏览器阻止
        });
    }

    // 生成文章索引（用于更新 index.html）
    generatePostIndex(posts) {
        return posts.map(post => {
            const filename = this.generateFilename(post);
            return {
                id: post.id,
                title: post.title,
                filename: filename,
                url: `posts/${filename}`,
                date: post.date,
                category: post.category,
                excerpt: post.excerpt,
                coverImage: post.coverImage
            };
        });
    }
}

// 创建全局实例
const postGenerator = new PostGenerator();
