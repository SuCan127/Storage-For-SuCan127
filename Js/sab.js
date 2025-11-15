// Smart App Banner 移除脚本
// 作者: SuCan127
// 说明: 移除 meta[name="apple-itunes-app"] 以及常见的 Smart App Banner DOM/脚本注入
// 适用于 Surge/QuantumultX 等能修改 http-response body 的环境

const method = $request.method;
const url = $request.url;
const status = $response.status;
let headers = $response.headers || {};
const notifiTitle = "移除 Smart App Banner 错误";

function getHeaderCi(name) {
    // 不区分大小写获取 header 值
    return headers[name] || headers[name.toLowerCase()] || "";
}

if (method !== "GET" || status !== 200) {
    console.log(`method:${method}, status:${status}, url:${url}`);
    // 非 HTML 响应时不打扰用户，但在调试时留下通知以便排查（可注释掉）
    $notification && $notification.post && $notification.post(notifiTitle, "method/status 有误或非 200", `method:${method}, status:${status}`);
    $done({});
} else {
    const contentType = getHeaderCi('Content-Type');
    if (!/text\/html/i.test(contentType)) {
        console.log(`非 HTML 类型: ${contentType}, url:${url}`);
        $done({});
    } else {
        let body = $response.body || "";
        let originalLength = body.length;

        // 1) 移除 meta[name="apple-itunes-app"]
        body = body.replace(/<meta\s+[^>]*name=(["'])apple-itunes-app\1[^>]*>/ig, '');

        // 2) 移除带有 class/id 中含有 smart / smartbanner / app-banner / appbanner 等关键字的节点（尽量宽松匹配）
        // 匹配开始标签中含 class 或 id，随后整段节点删除（包括内部内容）
        body = body.replace(/<([a-z0-9-]+)\b[^>]*(?:\b(?:class|id)\s*=\s*["'][^"'>]*(?:smart|smartbanner|app-?banner|appbanner)[^"'>]*["'])[^>]*>[\s\S]*?<\/\1>/ig, '');
        // 匹配自闭合或无闭合的标签（例如 <div id="smartbanner" /> 或 <span class="smartbanner">）
        body = body.replace(/<([a-z0-9-]+)\b[^>]*(?:\b(?:class|id)\s*=\s*["'][^"'>]*(?:smart|smartbanner|app-?banner|appbanner)[^"'>]*["'])[^>]*\/?>/ig, '');

        // 3) 移除包含关键词（apple-itunes-app / smartbanner / Smart App Banner / smart app banner）的脚本块
        body = body.replace(/<script\b[^>]*>[\s\S]*?(?:apple-itunes-app|smartbanner|Smart App Banner|smart app banner|smartBanner)[\s\S]*?<\/script>/ig, '');

        // 4) 移除可能用于注入 banner 的 link 或 meta 相关项（保守匹配）
        body = body.replace(/<link\b[^>]*rel=(["'])(?:alternate|apple-touch-icon|apple-touch-icon-precomposed)\1[^>]*>/ig, '');
        body = body.replace(/<meta\b[^>]*content=["'][^"']*apple-itunes-app[^"']*["'][^>]*>/ig, '');

        // 5) 额外：移除内联包含 "smartbanner" / "apple-itunes-app" 注释或节点（保守）
        body = body.replace(/<!--[\s\S]*?(?:smartbanner|apple-itunes-app)[\s\S]*?-->/ig, '');

        // 删除 Content-Length 让代理/客户端重新计算（避免长度不匹配问题）
        delete headers['Content-Length'];
        delete headers['content-length'];

        let newLength = body.length;
        if (newLength !== originalLength) {
            console.log(`Smart App Banner 已移除: url:${url}, before:${originalLength}, after:${newLength}`);
            $notification && $notification.post && $notification.post("Smart App Banner", "已自动移除", url);
        } else {
            console.log(`无需移除 Smart App Banner 或未检测到匹配项: url:${url}`);
        }

        $done({
            headers,
            body
        });
    }
}
