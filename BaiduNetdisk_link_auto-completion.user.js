// ==UserScript==
// @name         百度网盘链接自动补全
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动识别网页中的百度网盘短链接，补全完整，附加提取码，并转换为新窗口打开的超链接。完美穿透B站 Shadow DOM。
// @author       Qwen
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 1. 样式定义 (需要注入到每个 Shadow DOM 内部)
    const CSS_TEXT = `
        .qwen-bd-link {
            color: #0066cc !important;
            text-decoration: underline;
            cursor: pointer;
            word-break: break-all;
            font-weight: bold;
            transition: color 0.2s;
        }
        .qwen-bd-link:hover {
            color: #ff9900 !important;
        }
    `;

    // 2. 正则表达式
    const idRegex = /(?<!pan\.baidu\.com\/)(?<!yun\.baidu\.com\/)(?<!baidu\.com\/s\/)(?<![a-zA-Z0-9])(?:\/?s\/)?(1[A-Za-z0-9_-]{22})(?![A-Za-z0-9_-])(?:\?pwd=([A-Za-z0-9]{4}))?/g;
    const pwdRegex = /(?:提取码|密码|提取密碼|密碼)[：:\s]*([a-zA-Z0-9]{4})/i;

    // 核心处理逻辑
    function processTextNode(node) {
        if (node.__qwen_processed) return;

        let text = node.nodeValue;
        if (!text) return;

        let parent = node.parentElement;
        if (!parent) return;

        const tag = parent.tagName;
        if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'A'].includes(tag)) return;
        if (parent.classList.contains('qwen-bd-link')) return;

        if (!/1[A-Za-z0-9_-]{22}/.test(text)) {
            node.__qwen_processed = true;
            return;
        }

        // 寻找块级父元素以提取提取码
        let parentBlock = parent;
        while (parentBlock && !['DIV', 'ARTICLE', 'SECTION', 'TD', 'TH', 'LI', 'P', 'PRE', 'BLOCKQUOTE', 'MAIN'].includes(parentBlock.tagName)) {
            parentBlock = parentBlock.parentElement;
        }

        if (!parentBlock) {
            // 关键：如果到达了 Shadow Root 的顶部，使用 Shadow Root 作为容器
            const rootNode = node.getRootNode();
            if (rootNode && rootNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE && rootNode.host) {
                parentBlock = rootNode;
            } else {
                parentBlock = document.body;
            }
        }

        const blockText = parentBlock.textContent || '';
        const pwdMatch = blockText.match(pwdRegex);
        const blockPwd = pwdMatch ? pwdMatch[1] : '';

        let match;
        let lastIndex = 0;
        let fragments = [];

        idRegex.lastIndex = 0;
        let hasMatch = false;

        while ((match = idRegex.exec(text)) !== null) {
            hasMatch = true;
            if (match.index > lastIndex) {
                fragments.push(document.createTextNode(text.substring(lastIndex, match.index)));
            }

            const id = match[1];
            const pwd = match[2] || blockPwd;
            let fullUrl = `https://pan.baidu.com/s/${id}`;
            if (pwd) fullUrl += `?pwd=${pwd}`;

            const a = document.createElement('a');
            a.href = fullUrl;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.className = 'qwen-bd-link';
            a.textContent = fullUrl;
            a.__qwen_processed = true;

            fragments.push(a);
            lastIndex = match.index + match[0].length;
        }

        if (!hasMatch) {
            node.__qwen_processed = true;
            return;
        }

        if (lastIndex < text.length) {
            fragments.push(document.createTextNode(text.substring(lastIndex)));
        }

        const fragment = document.createDocumentFragment();
        fragments.forEach(f => fragment.appendChild(f));

        if (parent && node.parentNode === parent) {
            parent.replaceChild(fragment, node);
        }
    }

    // 扫描当前层的文本节点
    function scanTextNodes(root) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (node.__qwen_processed) return NodeFilter.FILTER_REJECT;
                    if (!node.nodeValue || !/1[A-Za-z0-9_-]{22}/.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const textNodes = [];
        let n;
        while (n = walker.nextNode()) {
            textNodes.push(n);
        }
        textNodes.forEach(processTextNode);
    }

    // 深度递归扫描：穿透 Shadow DOM
    function deepScanAndProcess(node) {
        if (!node) return;

        if (node.nodeType === Node.ELEMENT_NODE) {
            // 发现 Shadow Host，进入结界！
            if (node.shadowRoot) {
                initShadowRoot(node.shadowRoot);
                deepScanAndProcess(node.shadowRoot);
            }

            // 遍历普通子元素
            const children = node.children;
            for (let i = 0; i < children.length; i++) {
                deepScanAndProcess(children[i]);
            }
        } else if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            // Shadow Root 本身
            const children = node.children;
            for (let i = 0; i < children.length; i++) {
                deepScanAndProcess(children[i]);
            }
        }

        // 扫描当前层的文本
        scanTextNodes(node);
    }

    // 初始化 Shadow Root：注入样式和监听器
    function initShadowRoot(shadowRoot) {
        if (shadowRoot.__qwen_initialized) return;
        shadowRoot.__qwen_initialized = true;

        // 1. 注入样式到结界内部
        const style = document.createElement('style');
        style.textContent = CSS_TEXT;
        shadowRoot.appendChild(style);

        // 2. 在结界内部绑定监听器
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        scheduleProcess(node);
                    });
                } else if (mutation.type === 'characterData') {
                    if (mutation.target.nodeType === Node.TEXT_NODE) {
                        mutation.target.__qwen_processed = false;
                        scheduleProcess(mutation.target);
                    }
                }
            });
        });

        observer.observe(shadowRoot, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // 延迟处理队列 (防抖 + 避开框架渲染)
    let pendingNodes = new Set();
    let rafId = null;

    function scheduleProcess(node) {
        pendingNodes.add(node);
        if (!rafId) {
            rafId = requestAnimationFrame(() => {
                rafId = null;
                const nodesToProcess = Array.from(pendingNodes);
                pendingNodes.clear();

                nodesToProcess.forEach(n => {
                    if (n.nodeType === Node.TEXT_NODE) {
                        processTextNode(n);
                    } else if (n.nodeType === Node.ELEMENT_NODE || n.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                        deepScanAndProcess(n);
                    }
                });
            });
        }
    }

    // 全局 Observer：发现新添加的 Shadow Host
    const globalObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    deepScanAndProcess(node);
                } else if (node.nodeType === Node.TEXT_NODE) {
                    scheduleProcess(node);
                }
            });
        });
    });

    globalObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始扫描
    deepScanAndProcess(document.body);

})();
