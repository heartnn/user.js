// ==UserScript==
// @name         百度网盘链接自动补全并高亮
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动识别网页中的百度网盘短链接，补全完整，附加提取码，并转换为新窗口打开的超链接。
// @author       Qwen
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 1. 注入一点 CSS 样式，让生成的链接更显眼、更好看
    const style = document.createElement('style');
    style.textContent = `
        .qwen-bd-link {
            color: #0066cc !important;       /* 经典链接蓝 */
            text-decoration: underline;      /* 下划线 */
            cursor: pointer;                 /* 鼠标放上去变小手 */
            word-break: break-all;           /* 防止长链接撑爆网页排版 */
            font-weight: bold;               /* 稍微加粗 */
            transition: color 0.2s;
        }
        .qwen-bd-link:hover {
            color: #ff9900 !important;       /* 鼠标悬停时变成橙色 */
        }
    `;
    document.head.appendChild(style);

    // 2. 核心正则：匹配百度网盘分享ID和自带提取码
    const idRegex = /(?<!pan\.baidu\.com\/)(?<!yun\.baidu\.com\/)(?<!baidu\.com\/s\/)(?<![a-zA-Z0-9])(?:\/?s\/)?(1[A-Za-z0-9_-]{22})(?![A-Za-z0-9_-])(?:\?pwd=([A-Za-z0-9]{4}))?/g;

    // 周围文本提取码正则
    const pwdRegex = /(?:提取码|密码|提取密碼|密碼)[：:\s]*([a-zA-Z0-9]{4})/i;

    // 处理单个文本节点，将其拆分为 [普通文本, <a>链接, 普通文本...]
    function processTextNode(node) {
        let text = node.nodeValue;
        if (!text) return;

        let parent = node.parentElement;
        if (!parent) return;
        
        const tag = parent.tagName;
        // 过滤掉不需要处理的标签，以及我们自己生成的链接内部文本（防死循环）
        if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'A'].includes(tag)) return;
        if (parent.classList.contains('qwen-bd-link')) return;

        // 快速检查，如果文本中没有可能的ID，直接跳过以提升性能
        if (!/1[A-Za-z0-9_-]{22}/.test(text)) return;

        // 寻找最近的块级父元素（如 DIV, ARTICLE），以便在整个帖子容器中查找提取码
        let parentBlock = parent;
        while (parentBlock && !['DIV', 'ARTICLE', 'SECTION', 'TD', 'TH', 'LI', 'P', 'PRE', 'BLOCKQUOTE', 'MAIN'].includes(parentBlock.tagName)) {
            parentBlock = parentBlock.parentElement;
        }
        if (!parentBlock) parentBlock = document.body;

        // 提取密码
        const blockText = parentBlock.textContent || '';
        const pwdMatch = blockText.match(pwdRegex);
        const blockPwd = pwdMatch ? pwdMatch[1] : '';

        let match;
        let lastIndex = 0;
        let fragments = []; // 用来存放拆分后的文本和链接碎片
        
        idRegex.lastIndex = 0; // 重置正则匹配位置

        let hasMatch = false;
        while ((match = idRegex.exec(text)) !== null) {
            hasMatch = true;
            
            // 把匹配前面的普通文字收集起来
            if (match.index > lastIndex) {
                fragments.push(document.createTextNode(text.substring(lastIndex, match.index)));
            }

            // 构造完整的 URL
            const id = match[1];
            const pwd = match[2] || blockPwd; // 优先用自带的，没有就用上下文找到的
            let fullUrl = `https://pan.baidu.com/s/${id}`;
            if (pwd) {
                fullUrl += `?pwd=${pwd}`;
            }

            // 创建 <a> 标签
            const a = document.createElement('a');
            a.href = fullUrl;
            a.target = '_blank';               // 在新窗口打开
            a.rel = 'noopener noreferrer';     // 安全最佳实践，防止新窗口劫持原窗口
            a.className = 'qwen-bd-link';      // 加上我们定义的 CSS class
            a.textContent = fullUrl;           // 显示完整的 URL 文本

            fragments.push(a);

            lastIndex = match.index + match[0].length;
        }

        if (!hasMatch) return;

        // 把匹配后面的剩余文字也收集起来
        if (lastIndex < text.length) {
            fragments.push(document.createTextNode(text.substring(lastIndex)));
        }

        // 将收集好的碎片打包，替换掉原来的纯文本节点
        const fragment = document.createDocumentFragment();
        fragments.forEach(f => fragment.appendChild(f));
        parent.replaceChild(fragment, node);
    }

    // 辅助函数：扫描指定根节点下的所有文本节点
    function scanAndProcess(root) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        // 先把所有文本节点收集到数组里。
        // 这一步很关键：因为 processTextNode 会修改 DOM，如果在遍历树时修改，会导致遍历错乱。
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        textNodes.forEach(processTextNode);
    }

    // 3. 页面加载完成后，先处理现有的内容
    scanAndProcess(document.body);

    // 4. 使用 MutationObserver 监听动态添加的内容（比如论坛懒加载、展开评论等）
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    processTextNode(node);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    scanAndProcess(node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();