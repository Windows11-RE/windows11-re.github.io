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

// 获取文章数据
function getPosts() {
    return JSON.parse(localStorage.getItem('blogPosts') || '[]');
}

// 旧的文章数据（已废弃，保留用于参考）
const oldPosts = [
    {
        id: 1,
        title: "自我介绍",
        date: "2025-11-22",
        author: "SYSTEM_Win11_RE",
        excerpt: "这是关于我的自我介绍。",
        coverImage: "https://picsum.photos/800/400?random=1", // 封面图（可选）
        content: `
            <p>欢迎来到我的个人博客！以下是自我介绍。</p>
            
            <h3>我是谁</h3>
            <p>写博客是一个很好的学习和分享方式。通过写作，我可以：</p>
            <ul>
                <li>整理和巩固自己的知识</li>
                <li>与他人分享经验和见解</li>
                <li>记录自己的成长历程</li>
                <li>结识志同道合的朋友</li>
            </ul>
            
            <h3>博客内容</h3>
            <p>在这个博客中，我将分享：</p>
            <ul>
                <li>前端开发技术和经验</li>
                <li>项目开发心得</li>
                <li>学习笔记和总结</li>
                <li>生活中的思考和感悟</li>
            </ul>
            
            <p>希望我的分享能对你有所帮助。如果你有任何问题或建议，欢迎在评论区留言！</p>
        `
    },
    {
        id: 2,
        title: "JavaScript 异步编程指南",
        date: "2025-11-20",
        author: "博主",
        excerpt: "深入理解 JavaScript 中的异步编程，包括回调函数、Promise 和 async/await 的使用方法。",
        coverImage: "https://picsum.photos/800/400?random=2",
        content: `
            <p>JavaScript 的异步编程是前端开发中非常重要的概念。本文将详细介绍异步编程的三种主要方式。</p>
            
            <h3>1. 回调函数（Callback）</h3>
            <p>回调函数是最基础的异步处理方式：</p>
            <pre><code>function fetchData(callback) {
    setTimeout(() => {
        callback('数据加载完成');
    }, 1000);
}

fetchData((data) => {
    console.log(data);
});</code></pre>
            
            <h3>2. Promise</h3>
            <p>Promise 提供了更优雅的异步处理方式：</p>
            <pre><code>function fetchData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('数据加载完成');
        }, 1000);
    });
}

fetchData()
    .then(data => console.log(data))
    .catch(error => console.error(error));</code></pre>
            
            <h3>3. Async/Await</h3>
            <p>Async/Await 是最现代的异步编程方式：</p>
            <pre><code>async function loadData() {
    try {
        const data = await fetchData();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

loadData();</code></pre>
            
            <h3>总结</h3>
            <p>掌握这三种异步编程方式，能让你的 JavaScript 代码更加优雅和高效。</p>
        `
    },
    {
        id: 3,
        title: "CSS Grid 布局实战",
        date: "2025-11-18",
        author: "博主",
        excerpt: "通过实际案例学习 CSS Grid 布局系统，掌握现代网页布局的强大工具。",
        coverImage: "https://picsum.photos/800/400?random=3",
        content: `
            <p>CSS Grid 是一个强大的二维布局系统，让网页布局变得更加简单和灵活。</p>
            
            <h3>基础概念</h3>
            <p>Grid 布局将容器划分为行和列，形成一个网格系统：</p>
            <pre><code>.container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
}</code></pre>
            
            <h3>实战案例：响应式卡片布局</h3>
            <p>使用 Grid 创建自适应的卡片布局：</p>
            <pre><code>.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
}</code></pre>
            
            <h3>Grid vs Flexbox</h3>
            <p>Grid 适合二维布局，Flexbox 适合一维布局。两者可以配合使用：</p>
            <ul>
                <li>Grid：整体页面布局</li>
                <li>Flexbox：组件内部布局</li>
            </ul>
            
            <h3>浏览器支持</h3>
            <p>现代浏览器都已经很好地支持 CSS Grid，可以放心使用。</p>
        `
    },
    {
        id: 4,
        title: "如何提高代码质量",
        date: "2025-11-15",
        author: "博主",
        excerpt: "分享一些提高代码质量的实用技巧，包括代码规范、测试、重构等方面的经验。",
        coverImage: "https://picsum.photos/800/400?random=4",
        content: `
            <p>高质量的代码不仅易于维护，还能提高开发效率。以下是一些实用的建议。</p>
            
            <h3>1. 遵循代码规范</h3>
            <p>统一的代码风格让团队协作更加顺畅：</p>
            <ul>
                <li>使用 ESLint 进行代码检查</li>
                <li>使用 Prettier 格式化代码</li>
                <li>制定团队编码规范</li>
            </ul>
            
            <h3>2. 编写有意义的注释</h3>
            <p>好的注释能帮助他人（包括未来的自己）理解代码：</p>
            <pre><code>// 不好的注释
let x = 10; // 设置 x 为 10

// 好的注释
// 设置最大重试次数，避免无限循环
const MAX_RETRY_COUNT = 10;</code></pre>
            
            <h3>3. 保持函数简洁</h3>
            <p>一个函数应该只做一件事，并且做好：</p>
            <ul>
                <li>函数长度不超过 50 行</li>
                <li>参数不超过 3 个</li>
                <li>避免嵌套过深</li>
            </ul>
            
            <h3>4. 编写测试</h3>
            <p>测试能确保代码的正确性和稳定性：</p>
            <ul>
                <li>单元测试：测试独立的函数和模块</li>
                <li>集成测试：测试模块之间的交互</li>
                <li>端到端测试：测试完整的用户流程</li>
            </ul>
            
            <h3>5. 持续重构</h3>
            <p>定期审查和优化代码，消除技术债务。</p>
            
            <p>记住：代码是写给人看的，只是顺便让机器执行而已。</p>
        `
    }
];

// 从 URL 获取文章 ID
function getPostIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

// 加载文章详情
function loadPostDetail() {
    const postId = getPostIdFromUrl();
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    const container = document.getElementById('post-detail');
    
    if (!post) {
        container.innerHTML = `
            <div class="error-message">
                <h2>😕 文章不存在</h2>
                <p>抱歉，您访问的文章不存在或已被删除。</p>
                <a href="index.html" class="btn">返回首页</a>
            </div>
        `;
        return;
    }
    
    // 检查文章可见性
    if (post.visibility === 'private' && !isAuthenticated()) {
        container.innerHTML = `
            <div class="error-message">
                <h2>🔒 私密文章</h2>
                <p>这是一篇私密文章，仅作者可见。</p>
                <a href="login.html" class="btn">登录查看</a>
                <a href="index.html" class="btn btn-secondary">返回首页</a>
            </div>
        `;
        return;
    }
    
    // 更新页面标题
    document.title = `${post.title} - 我的个人博客`;
    
    // 渲染 Markdown 内容
    const renderedContent = marked.parse(post.content);
    
    // 渲染文章内容
    container.innerHTML = `
        <header class="post-header">
            <h1>${post.title}</h1>
            <div class="post-meta">
                <span>📅 ${post.date}</span>
                <span>✍️ ${post.author || '博主'}</span>
                <span>📁 ${post.category || '未分类'}</span>
            </div>
        </header>
        ${post.coverImage ? `<img src="${post.coverImage}" alt="${post.title}" class="post-cover">` : ''}
        <div class="post-content markdown-content">
            ${renderedContent}
        </div>
    `;
}

// 加载评论区
function loadComments() {
    const postId = getPostIdFromUrl();
    const commentsContainer = document.getElementById('comments-container');
    
    // 从 localStorage 获取评论数据
    const allComments = JSON.parse(localStorage.getItem('blogComments') || '{}');
    const postComments = allComments[postId] || [];
    
    // 渲染评论表单
    const commentForm = `
        <div class="comment-form">
            <h3>发表评论</h3>
            <form id="new-comment-form">
                <div class="form-group">
                    <input type="text" id="comment-name" placeholder="昵称 *" required>
                </div>
                <div class="form-group">
                    <input type="email" id="comment-email" placeholder="邮箱（不会公开）*" required>
                </div>
                <div class="form-group">
                    <div class="editor-toolbar">
                        <button type="button" class="toolbar-btn" data-action="bold" title="粗体">
                            <strong>B</strong>
                        </button>
                        <button type="button" class="toolbar-btn" data-action="italic" title="斜体">
                            <em>I</em>
                        </button>
                        <button type="button" class="toolbar-btn" data-action="code" title="行内代码">
                            &lt;/&gt;
                        </button>
                        <button type="button" class="toolbar-btn" data-action="link" title="插入链接">
                            🔗
                        </button>
                        <button type="button" class="toolbar-btn" data-action="image" title="插入图片">
                            🖼️
                        </button>
                        <button type="button" class="toolbar-btn" data-action="quote" title="引用">
                            💬
                        </button>
                        <button type="button" class="toolbar-btn" data-action="list" title="列表">
                            📝
                        </button>
                        <button type="button" class="toolbar-btn" data-action="emoji" title="表情符号">
                            😊
                        </button>
                    </div>
                    <textarea id="comment-content" placeholder="写下你的评论（支持 Markdown 格式）... *" rows="8" required></textarea>
                </div>
                <div class="markdown-preview-toggle">
                    <label>
                        <input type="checkbox" id="preview-toggle"> 预览效果
                    </label>
                </div>
                <div id="markdown-preview" class="markdown-preview" style="display: none;"></div>
                <button type="submit" class="btn">提交评论</button>
            </form>
        </div>
        
        <!-- 表情选择器 -->
        <div id="emoji-picker" class="emoji-picker" style="display: none;">
            <div class="emoji-picker-header">
                <span>选择表情</span>
                <button type="button" class="emoji-close">✕</button>
            </div>
            <div class="emoji-grid">
                ${getEmojiList().map(emoji => `<span class="emoji-item" data-emoji="${emoji}">${emoji}</span>`).join('')}
            </div>
        </div>
    `;
    
    // 渲染评论列表
    let commentsList = '<div class="comments-list">';
    if (postComments.length === 0) {
        commentsList += '<p class="no-comments">暂无评论，快来抢沙发吧！</p>';
    } else {
        commentsList += `<h3>评论 (${postComments.length})</h3>`;
        postComments.forEach(comment => {
            // 使用 marked 解析 Markdown
            const renderedContent = marked.parse(comment.content);
            commentsList += `
                <div class="comment-item">
                    <div class="comment-header">
                        <span class="comment-author">${escapeHtml(comment.name)}</span>
                        <span class="comment-date">${comment.date}</span>
                    </div>
                    <div class="comment-content markdown-content">${renderedContent}</div>
                </div>
            `;
        });
    }
    commentsList += '</div>';
    
    commentsContainer.innerHTML = commentForm + commentsList;
    
    // 绑定表单提交事件
    document.getElementById('new-comment-form').addEventListener('submit', handleCommentSubmit);
    
    // 绑定预览切换事件
    const previewToggle = document.getElementById('preview-toggle');
    const commentTextarea = document.getElementById('comment-content');
    const previewDiv = document.getElementById('markdown-preview');
    
    previewToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            const content = commentTextarea.value;
            previewDiv.innerHTML = marked.parse(content || '*预览区域为空*');
            previewDiv.style.display = 'block';
        } else {
            previewDiv.style.display = 'none';
        }
    });
    
    // 实时更新预览
    commentTextarea.addEventListener('input', () => {
        if (previewToggle.checked) {
            const content = commentTextarea.value;
            previewDiv.innerHTML = marked.parse(content || '*预览区域为空*');
        }
    });
    
    // 设置工具栏
    setupToolbar();
}

// 处理评论提交
function handleCommentSubmit(e) {
    e.preventDefault();
    
    const postId = getPostIdFromUrl();
    const name = document.getElementById('comment-name').value.trim();
    const email = document.getElementById('comment-email').value.trim();
    const content = document.getElementById('comment-content').value.trim();
    
    if (!name || !email || !content) {
        alert('请填写所有必填项！');
        return;
    }
    
    // 创建新评论
    const newComment = {
        id: Date.now(),
        name: name,
        email: email,
        content: content,
        date: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    // 保存到 localStorage
    const allComments = JSON.parse(localStorage.getItem('blogComments') || '{}');
    if (!allComments[postId]) {
        allComments[postId] = [];
    }
    allComments[postId].unshift(newComment); // 新评论显示在前面
    localStorage.setItem('blogComments', JSON.stringify(allComments));
    
    // 清空表单
    document.getElementById('new-comment-form').reset();
    
    // 重新加载评论
    loadComments();
    
    // 显示成功提示
    alert('评论发表成功！');
}

// HTML 转义函数，防止 XSS 攻击
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 获取表情列表
function getEmojiList() {
    return [
        '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
        '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
        '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
        '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨',
        '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
        '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕',
        '🤢', '🤮', '🤧', '🥵', '🥶', '😵', '🤯', '🤠',
        '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️',
        '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨',
        '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞',
        '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬',
        '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙',
        '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪',
        '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
        '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘',
        '⭐', '🌟', '✨', '💫', '🔥', '💥', '💯', '✅',
        '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉'
    ];
}

// 工具栏按钮处理
function setupToolbar() {
    const textarea = document.getElementById('comment-content');
    const toolbarBtns = document.querySelectorAll('.toolbar-btn');
    const emojiPicker = document.getElementById('emoji-picker');
    
    toolbarBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const action = btn.dataset.action;
            handleToolbarAction(action, textarea, emojiPicker);
        });
    });
    
    // 表情选择器关闭按钮
    const emojiClose = document.querySelector('.emoji-close');
    if (emojiClose) {
        emojiClose.addEventListener('click', () => {
            emojiPicker.style.display = 'none';
        });
    }
    
    // 表情选择
    const emojiItems = document.querySelectorAll('.emoji-item');
    emojiItems.forEach(item => {
        item.addEventListener('click', () => {
            insertAtCursor(textarea, item.dataset.emoji);
            emojiPicker.style.display = 'none';
            textarea.focus();
        });
    });
}

// 处理工具栏操作
function handleToolbarAction(action, textarea, emojiPicker) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let replacement = '';
    let cursorOffset = 0;
    
    switch (action) {
        case 'bold':
            replacement = `**${selectedText || '粗体文本'}**`;
            cursorOffset = selectedText ? replacement.length : -2;
            break;
        case 'italic':
            replacement = `*${selectedText || '斜体文本'}*`;
            cursorOffset = selectedText ? replacement.length : -1;
            break;
        case 'code':
            replacement = `\`${selectedText || '代码'}\``;
            cursorOffset = selectedText ? replacement.length : -1;
            break;
        case 'link':
            const url = prompt('请输入链接地址:', 'https://');
            if (url) {
                replacement = `[${selectedText || '链接文本'}](${url})`;
                cursorOffset = replacement.length;
            }
            break;
        case 'image':
            const imgUrl = prompt('请输入图片地址:', 'https://');
            if (imgUrl) {
                const altText = selectedText || '图片描述';
                replacement = `![${altText}](${imgUrl})`;
                cursorOffset = replacement.length;
            }
            break;
        case 'quote':
            replacement = `> ${selectedText || '引用内容'}`;
            cursorOffset = replacement.length;
            break;
        case 'list':
            const lines = selectedText ? selectedText.split('\n') : ['列表项 1', '列表项 2', '列表项 3'];
            replacement = lines.map(line => `- ${line}`).join('\n');
            cursorOffset = replacement.length;
            break;
        case 'emoji':
            emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
            return;
    }
    
    if (replacement) {
        textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + cursorOffset;
        textarea.focus();
        
        // 触发 input 事件以更新预览
        textarea.dispatchEvent(new Event('input'));
    }
}

// 在光标位置插入文本
function insertAtCursor(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.value = textarea.value.substring(0, start) + text + textarea.value.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
    
    // 触发 input 事件以更新预览
    textarea.dispatchEvent(new Event('input'));
}

// 图片灯箱功能
function setupImageLightbox() {
    // 创建灯箱元素
    if (!document.getElementById('image-lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.id = 'image-lightbox';
        lightbox.className = 'image-lightbox';
        lightbox.innerHTML = `
            <span class="lightbox-close">×</span>
            <img src="" alt="放大图片">
        `;
        document.body.appendChild(lightbox);
        
        // 点击关闭
        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }
    
    // 为评论中的图片添加点击事件
    document.addEventListener('click', (e) => {
        if (e.target.matches('.comment-content.markdown-content img')) {
            const lightbox = document.getElementById('image-lightbox');
            const lightboxImg = lightbox.querySelector('img');
            lightboxImg.src = e.target.src;
            lightbox.classList.add('active');
        }
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    loadPostDetail();
    setupImageLightbox();
    
    // 记录浏览次数
    const postId = getPostIdFromUrl();
    if (postId) {
        recordPostView(postId);
    }
});
