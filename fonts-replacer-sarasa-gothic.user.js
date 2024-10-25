// ==UserScript==
// @name                 Font-sub:Sarasa-Gothic
// @name:en-US           Font substitute: Sarasa Gothic
// @name:zh-CN           字体替换：更纱黑体
// @name:zh-TW           字体替换：更紗黑體
// @name:zh-HK           字体替换：更紗黑體
// @name:ja-JP           フォント置換：更紗ゴシック
// @name:ko-KR           글꼴 대체：사라사고딕
// @namespace            https://gist.github.com/heartnn/23bb0963d7db22504a3f0db2e338c821
// @version              99
// @author               zozovo
// @description          Substitute fonts with Sarasa Gothic CJK and Sarasa Mono.
// @description:en-US    Substitute fonts with Sarasa Gothic CJK and Sarasa Mono.
// @description:zh-CN    将字体替换为 更纱黑体（中日韩）和 等宽更纱黑体。
// @description:zh-TW    將字體替換為 更紗黑體（中日韓）和 等寬更紗黑體。
// @description:zh-HK    將字體替換為 更紗黑體（中日韓）和 等寬更紗黑體。
// @description:ja-JP    フォントを 更紗ゴシック（CJK） および 更紗ゴシック Mono に 置き換えます。
// @description:ko-KR    글꼴을 사라사고딕 CJK 및 사라사고딕 Mono 교체합니다.
// @match                *://*/*
// @run-at               document-start
// @grant                GM_addStyle
// @license              MIT
// @supportURL           https://gist.github.com/heartnn/23bb0963d7db22504a3f0db2e338c821
// ==/UserScript==


GM_addStyle(`
@font-face {
    font-family: "Color Emoji";
    src: local("Apple Color Emoji"), local("Noto Color Emoji"), local("Segoe UI Emoji");
    unicode-range: U+200C, U+200D, U+FE0E, U+FE0F, U+2190-21FF, U+27F?, U+2900-297F, U+2B??, U+23??, U+25A0-27BF, U+32??, U+1F???
}

@font-face {
    font-family: "Monochrome Emoji";
    src: local("Apple Monochrome Emoji"), local("Noto Emoji"), local("Segoe Fluent Icons"), local("Segoe MDL2 Assets");
    unicode-range: U+200C, U+200D, U+FE0E, U+FE0F, U+2190-21FF, U+27F?, U+2900-297F, U+2B??, U+23??, U+25A0-27BF, U+32??, U+1F???
}

@font-face {
    font-family: "Consolas";
    src: local("Sarasa Fixed SC"), local("Sarasa Fixed HC"), local("Sarasa Fixed TC"), local("Sarasa Fixed J"), local("Sarasa Fixed K")
}

@font-face {
    font-family: "Courier New";
    src: local("Sarasa Fixed SC"), local("Sarasa Fixed HC"), local("Sarasa Fixed TC"), local("Sarasa Fixed J"), local("Sarasa Fixed K")
}

:root {
    --icon-font-family: "Color Emoji", "Monochrome Emoji", dzicon;
    --normal-font-family: "Sarasa UI SC";
    --code-font-family: "Sarasa Fixed SC"
}

:is([lang$=HK], [lang$=MO]) {
    --normal-font-family: "Sarasa UI HC";
    --code-font-family: "Sarasa Fixed HC"
}

:is([lang$=TW], [lang$=hant]) {
    --normal-font-family: "Sarasa UI TC";
    --code-font-family: "Sarasa Fixed TC"
}

:lang(ja) {
    --normal-font-family: "Sarasa UI J";
    --code-font-family: "Sarasa Fixed J"
}

:lang(ko) {
    --normal-font-family: "Sarasa UI K";
    --code-font-family: "Sarasa Fixed K"
}

:not(#_#_) :not([class*=fa-], [class*=icon]):not([aria-hidden="true"] *, [role="presentation"] *, [role="none"] *) {

    &:not(i, s, a:hover, span, textarea):not([aria-hidden="true"], [role="presentation"], [role="none"]) {
        font-family: var(--icon-font-family), var(--normal-font-family), system-ui;

        &:where(pre, code, samp, kbd, var),
        &:where([class*=font-mono], [class*=cm-]) {
            font-family: var(--icon-font-family), var(--code-font-family), monospace;

            & :not(i, a, span) {
                font-family: var(--icon-font-family), var(--code-font-family), monospace;
            }
        }

        &:where([class*=code]:not(#readme, .readme)) {
            font-family: var(--icon-font-family), var(--code-font-family), monospace;
        }
    }
}
`);