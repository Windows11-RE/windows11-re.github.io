// 认证管理 - 原始版本备份
// 此文件是 auth.js 的原始版本备份，请勿删除
// 如果混淆版本出现问题，可以用此文件恢复

const AUTH_KEY = 'blogAuth';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24小时

// 管理员账号
const DEFAULT_ADMIN = {
    username: 'admin',
    password: 'A4FF6E052DADF38EA28A7E4A77E2104D'
};

// 检查是否已登录
function isAuthenticated() {
    const auth = localStorage.getItem(AUTH_KEY);
    if (!auth) return false;
    
    try {
        const authData = JSON.parse(auth);
        const now = Date.now();
        
        // 检查会话是否过期
        if (now - authData.timestamp > SESSION_DURATION) {
            logout();
            return false;
        }
        
        return authData.isAuthenticated === true;
    } catch (e) {
        return false;
    }
}

// 登录
function login(username, password) {
    if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
        const authData = {
            isAuthenticated: true,
            username: username,
            timestamp: Date.now()
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
        return true;
    }
    return false;
}

// 登出
function logout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = 'login.html';
}

// 获取当前用户
function getCurrentUser() {
    const auth = localStorage.getItem(AUTH_KEY);
    if (!auth) return null;
    
    try {
        const authData = JSON.parse(auth);
        return authData.username;
    } catch (e) {
        return null;
    }
}

// 保护页面（需要登录才能访问）
function protectPage() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

// 登录页面逻辑
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (login(username, password)) {
            alert('登录成功！');
            window.location.href = 'admin.html';
        } else {
            alert('用户名或密码错误！');
            document.getElementById('password').value = '';
            document.getElementById('password').focus();
        }
    });
}
