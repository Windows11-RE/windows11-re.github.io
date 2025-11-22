// GitHub 配置页面逻辑

// 加载配置
function loadConfig() {
    const config = githubStorage.loadConfig();
    
    document.getElementById('github-owner').value = config.owner || '';
    document.getElementById('github-repo').value = config.repo || '';
    document.getElementById('github-token').value = config.token || '';
    document.getElementById('github-branch').value = config.branch || 'main';
    
    updateConfigStatus();
}

// 更新配置状态
function updateConfigStatus() {
    const statusDiv = document.getElementById('config-status');
    
    if (githubStorage.isConfigured()) {
        const config = githubStorage.config;
        statusDiv.innerHTML = `
            <div class="status-success">
                <strong>✅ 已配置</strong>
                <p>仓库: <code>${config.owner}/${config.repo}</code></p>
                <p>分支: <code>${config.branch}</code></p>
            </div>
        `;
    } else {
        statusDiv.innerHTML = `
            <div class="status-warning">
                <strong>⚠️ 未配置</strong>
                <p>请填写下方配置信息以启用 GitHub 存储</p>
            </div>
        `;
    }
}

// 保存配置
document.getElementById('github-config-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const config = {
        owner: document.getElementById('github-owner').value.trim(),
        repo: document.getElementById('github-repo').value.trim(),
        token: document.getElementById('github-token').value.trim(),
        branch: document.getElementById('github-branch').value.trim() || 'main'
    };
    
    if (!config.owner || !config.repo || !config.token) {
        alert('请填写所有必填项！');
        return;
    }
    
    githubStorage.saveConfig(config);
    updateConfigStatus();
    alert('配置已保存！建议点击"测试连接"验证配置。');
});

// 测试连接
async function testConnection() {
    if (!githubStorage.isConfigured()) {
        alert('请先保存配置！');
        return;
    }
    
    const statusDiv = document.getElementById('sync-status');
    statusDiv.innerHTML = '<p class="status-loading">🔄 正在测试连接...</p>';
    
    try {
        // 尝试获取仓库信息
        const url = `https://api.github.com/repos/${githubStorage.config.owner}/${githubStorage.config.repo}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${githubStorage.config.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            const repo = await response.json();
            statusDiv.innerHTML = `
                <div class="status-success">
                    <strong>✅ 连接成功！</strong>
                    <p>仓库: ${repo.full_name}</p>
                    <p>可见性: ${repo.private ? '私有' : '公开'}</p>
                </div>
            `;
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        statusDiv.innerHTML = `
            <div class="status-error">
                <strong>❌ 连接失败</strong>
                <p>${error.message}</p>
                <p>请检查配置是否正确</p>
            </div>
        `;
    }
}

// 推送到 GitHub
async function syncToGitHub() {
    if (!githubStorage.isConfigured()) {
        alert('请先配置 GitHub！');
        return;
    }
    
    if (!confirm('确定要将本地数据推送到 GitHub 吗？\n\n这将覆盖 GitHub 上的现有数据。')) {
        return;
    }
    
    const statusDiv = document.getElementById('sync-status');
    statusDiv.innerHTML = '<p class="status-loading">🔄 正在推送数据...</p>';
    
    try {
        await githubStorage.syncAll((taskName, current, total) => {
            statusDiv.innerHTML = `
                <p class="status-loading">
                    🔄 正在推送 ${taskName}... (${current}/${total})
                </p>
            `;
        });
        
        statusDiv.innerHTML = `
            <div class="status-success">
                <strong>✅ 推送成功！</strong>
                <p>所有数据已同步到 GitHub</p>
                <p>文件位置: <code>${githubStorage.config.owner}/${githubStorage.config.repo}</code></p>
            </div>
        `;
    } catch (error) {
        console.error('推送错误详情:', error);
        statusDiv.innerHTML = `
            <div class="status-error">
                <strong>❌ 推送失败</strong>
                <p>${error.message}</p>
                <details>
                    <summary>查看详细信息</summary>
                    <pre>${error.stack || '无详细信息'}</pre>
                </details>
                <p><strong>可能的原因：</strong></p>
                <ul>
                    <li>Token 权限不足（需要 repo 权限）</li>
                    <li>仓库不存在或无法访问</li>
                    <li>网络连接问题</li>
                    <li>数据格式错误</li>
                </ul>
            </div>
        `;
    }
}

// 从 GitHub 拉取
async function pullFromGitHub() {
    if (!githubStorage.isConfigured()) {
        alert('请先配置 GitHub！');
        return;
    }
    
    if (!confirm('确定要从 GitHub 拉取数据吗？\n\n这将覆盖本地数据。建议先导出备份。')) {
        return;
    }
    
    const statusDiv = document.getElementById('sync-status');
    statusDiv.innerHTML = '<p class="status-loading">🔄 正在拉取数据...</p>';
    
    try {
        await githubStorage.pullAll((taskName, current, total) => {
            statusDiv.innerHTML = `
                <p class="status-loading">
                    🔄 正在拉取 ${taskName}... (${current}/${total})
                </p>
            `;
        });
        
        statusDiv.innerHTML = `
            <div class="status-success">
                <strong>✅ 拉取成功！</strong>
                <p>数据已从 GitHub 同步到本地</p>
                <p>页面将在 2 秒后刷新...</p>
            </div>
        `;
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    } catch (error) {
        console.error('拉取错误详情:', error);
        statusDiv.innerHTML = `
            <div class="status-error">
                <strong>❌ 拉取失败</strong>
                <p>${error.message}</p>
                <p><strong>可能的原因：</strong></p>
                <ul>
                    <li>GitHub 上还没有数据（请先推送）</li>
                    <li>Token 权限不足</li>
                    <li>网络连接问题</li>
                </ul>
            </div>
        `;
    }
}

// 查看 GitHub 数据
function viewGitHubData() {
    if (!githubStorage.isConfigured()) {
        alert('请先配置 GitHub！');
        return;
    }
    
    const config = githubStorage.config;
    const url = `https://github.com/${config.owner}/${config.repo}/tree/${config.branch}/${config.dataPath}`;
    window.open(url, '_blank');
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 保护页面
    protectPage();
    
    loadConfig();
});
