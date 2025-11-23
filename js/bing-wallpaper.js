// 必应每日一图 API
// 为网站添加动态背景图片

class BingWallpaper {
    constructor() {
        this.apiUrl = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN';
        this.baseUrl = 'https://www.bing.com';
        this.cacheKey = 'bingWallpaperCache';
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24小时
    }

    // 获取缓存的壁纸数据
    getCachedWallpaper() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (!cached) return null;

            const data = JSON.parse(cached);
            const now = Date.now();

            // 检查缓存是否过期
            if (now - data.timestamp > this.cacheExpiry) {
                localStorage.removeItem(this.cacheKey);
                return null;
            }

            return data;
        } catch (error) {
            console.error('读取缓存失败:', error);
            return null;
        }
    }

    // 缓存壁纸数据
    cacheWallpaper(data) {
        try {
            const cacheData = {
                ...data,
                timestamp: Date.now()
            };
            localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
        } catch (error) {
            console.error('缓存失败:', error);
        }
    }

    // 获取必应每日一图
    async fetchWallpaper() {
        try {
            // 先检查缓存
            const cached = this.getCachedWallpaper();
            if (cached) {
                console.log('使用缓存的壁纸');
                return cached;
            }

            // 从 API 获取
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error('获取壁纸失败');
            }

            const data = await response.json();
            if (!data.images || data.images.length === 0) {
                throw new Error('没有可用的壁纸');
            }

            const image = data.images[0];
            const wallpaperData = {
                url: this.baseUrl + image.url,
                title: image.title,
                copyright: image.copyright,
                copyrightlink: image.copyrightlink
            };

            // 缓存数据
            this.cacheWallpaper(wallpaperData);

            return wallpaperData;
        } catch (error) {
            console.error('获取必应壁纸失败:', error);
            // 返回默认渐变背景
            return {
                url: null,
                title: '默认背景',
                copyright: '',
                copyrightlink: ''
            };
        }
    }

    // 应用壁纸到元素
    async applyWallpaper(selector, options = {}) {
        const {
            overlay = true,
            overlayColor = 'rgba(0, 0, 0, 0.3)',
            blur = false,
            blurAmount = '5px'
        } = options;

        const wallpaper = await this.fetchWallpaper();
        const element = document.querySelector(selector);

        if (!element) {
            console.error('找不到元素:', selector);
            return;
        }

        if (wallpaper.url) {
            // 设置背景图片
            element.style.backgroundImage = `url('${wallpaper.url}')`;
            element.style.backgroundSize = 'cover';
            element.style.backgroundPosition = 'center';
            element.style.backgroundRepeat = 'no-repeat';
            element.style.backgroundAttachment = 'fixed';

            // 添加模糊效果
            if (blur) {
                element.style.filter = `blur(${blurAmount})`;
            }

            // 添加遮罩层
            if (overlay) {
                const overlayDiv = document.createElement('div');
                overlayDiv.className = 'bing-wallpaper-overlay';
                overlayDiv.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: ${overlayColor};
                    z-index: -1;
                    pointer-events: none;
                `;
                document.body.appendChild(overlayDiv);
            }

            // 添加版权信息（可选）
            if (wallpaper.copyright) {
                this.addCopyrightInfo(wallpaper);
            }
        } else {
            // 使用默认渐变背景
            element.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    }

    // 添加版权信息
    addCopyrightInfo(wallpaper) {
        // 检查是否已存在
        if (document.querySelector('.bing-copyright')) return;

        const copyrightDiv = document.createElement('div');
        copyrightDiv.className = 'bing-copyright';
        copyrightDiv.innerHTML = wallpaper.copyrightlink
            ? `<a href="${wallpaper.copyrightlink}" target="_blank" rel="noopener">${wallpaper.copyright}</a>`
            : wallpaper.copyright;

        copyrightDiv.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 1000;
            backdrop-filter: blur(10px);
        `;

        copyrightDiv.querySelector('a')?.setAttribute('style', 'color: white; text-decoration: none;');

        document.body.appendChild(copyrightDiv);
    }

    // 预加载壁纸（提前加载，提升体验）
    async preloadWallpaper() {
        const wallpaper = await this.fetchWallpaper();
        if (wallpaper.url) {
            const img = new Image();
            img.src = wallpaper.url;
        }
    }
}

// 创建全局实例
const bingWallpaper = new BingWallpaper();

// 便捷函数：应用到 body
async function applyBingWallpaperToBody(options = {}) {
    await bingWallpaper.applyWallpaper('body', options);
}

// 便捷函数：应用到特定元素
async function applyBingWallpaperToElement(selector, options = {}) {
    await bingWallpaper.applyWallpaper(selector, options);
}
