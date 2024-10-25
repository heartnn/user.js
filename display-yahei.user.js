// ==UserScript==
// @name           网页字体替换为微软雅黑
// @namespace      https://greasyfork.org/users/10250
// @description    网页字体替换为微软雅黑(优先)或思源黑体
// @include        *:*
// @author         heartnn
// @homepage       https://www.heartnn.com/
// @supportURL     https://greasyfork.org/zh-CN/scripts/374194
// @version        1.07
// @license        MIT
// ==/UserScript==
(function() {
    function addStyle(rules) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }

    addStyle(`
             @font-face{font-family:"Apple Color Emoji";src:local("Apple Color Emoji");unicode-range:U+2100-10FFFF}
             @font-face{font-family:"Segoe UI Emoji";src:local("Segoe UI Emoji");unicode-range:U+2100-10FFFF}
             :not(i,s,a:hover,span,textarea,[aria-hidden=true],[class^=fa],[class*=icon],#_#_){font-family:"Apple Color Emoji","Segoe UI Emoji",-apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "Microsoft YaHei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp",icomoon,iconfont,brand-icons,FontAwesome,genericons,Inconsolata,"Material Icons","Material Icons Extended","Glyphicons Halflings","dzicon",sans-serif,system-ui}
             :root :is(pre,code,textarea,samp,kbd,var,[class*=code],#_#_){font-family:"Apple Color Emoji","Segoe UI Emoji",ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono","Source Han Mono SC","Noto Sans Mono CJK SC","Microsoft YaHei Mono","WenQuanYi Micro Hei Mono",monospace}
             :root :is(pre,code,textarea,samp,kbd,var,[class*=code],#_#_) :is(a,span){font-family:"Apple Color Emoji","Segoe UI Emoji",ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono","Source Han Mono SC","Noto Sans Mono CJK SC","Microsoft YaHei Mono","WenQuanYi Micro Hei Mono",monospace}
             `);
})();