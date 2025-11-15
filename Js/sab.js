// Smart App Banner 移除脚本 (sab.js)
// 作者: SuCan127
// 说明: 移除 meta[name="apple-itunes-app"] 以及常见的 Smart App Banner 注入（meta/link/script/DOM）
// 适用: Loon / Surge / Quantumult X 等支持 http-response body 修改的环境
// 使用规则示例（已由用户提供）需设置 requires-body=true

const method = $request.method;
const url = $request.url;
const status = $response.status;
let headers = $response.headers || {};
const notifiTitle = "移除 Smart App Banner";

function getHeaderCi(name) {
    return headers[name] || headers[name.toLowerCase()] || "";
}

// 只处理 GET 且为 HTML 的响应；其他情况直接放行，避免通知轰炸（例如 generate_204 的 HEAD 请求）
if (method !== "GET") {
    console.log(`非 GET 请求，跳过处理: method:${method}, status:${status}, url:${url}`);
    $done({});
} else if (![200, 206].includes(status)) {
    console.log(`非 200/206 响应，跳过处理: method:${method}, status:${status}, url:${url}`);
    $done({});
} else {
    const contentType = getHeaderCi('Content-Type');
    if (!/text\/html/i.test(contentType)) {
        console.log(`非 HTML 内容，跳过处理: Content-Type:${contentType}, url:${url}`);
        $done({});
    } else {
        let body = $response.body || "";
        const originalLength = body.length;

        // 1) 移除 <meta name="apple-itunes-app" ...>
        body = body.replace(/<meta\s+[^>]*name=(["'])apple-itunes-app\1[^>]*>/ig, '');

        // 2) 移除 <meta content="...apple-itunes-app..." ...>
        body = body.replace(/<meta\b[^>]*content=(["'])[^"'>]*apple-itunes-app[^"'>]*\1[^>]*>/ig, '');

        // 3) 移除包含 smartbanner / smart app banner / app-banner / appbanner 等关键字的元素（保守删除）
        //    匹配带有 class 或 id 包含关键字的成对元素及自闭合标签
        body = body.replace(/<([a-z0-9-]+)\b[^>]*(?:\b(class|id)\s*=\s*["'][^"'>]*(?:smart(?:\s|-)??app|smartbanner|app-?banner|appbanner)[^"'>]*["'])[^>]*>[\s\S]*?<\/\1>/ig, '');
        body = body.replace(/<([a-z0-9-]+)\b[^>]*(?:\b(class|id)\s*=\s*["'][^"'>]*(?:smart(?:\s|-)??app|smartbanner|app-?banner|appbanner)[^"'>]*["'])[^>]*\/?>/ig, '');

        // 4) 移除包含 apple-itunes-app / smartbanner 等关键字的脚本块（内联脚本）
        body = body.replace(/<script\b[^>]*>[\s\S]*?(?:apple-itunes-app|smartbanner|Smart App Banner|smart app banner|smartBanner|SmartAppBanner)[\s\S]*?<\/script>/ig, '');

        // 5) 移除可能用于注入的 link/meta（保守匹配：rel/app-id 等）
        body = body.replace(/<link\b[^>]*(?:rel=(["'])(?:alternate|apple-touch-icon|apple-touch-icon-precomposed|manifest)\1)[^>]*>/ig, '');
        body = body.replace(/<meta\b[^>]*(?:name=(["'])(?:apple-itunes-app)\1)[^>]*>/ig, '');

        // 6) 移除包含 smartbanner / apple-itunes-app 的注释
        body = body.replace(/<!--[\s\S]*?(?:smartbanner|apple-itunes-app|Smart App Banner)[\s\S]*?-->/ig, '');

        // 若修改了 body，删除 Content-Length 让客户端或代理重新计算（避免长度不匹配）
        if (body.length !== originalLength) {
            delete headers['Content-Length'];
            delete headers['content-length'];

            console.log(`已尝试移除 Smart App Banner: url:${url}, before:${originalLength}, after:${body.length}`);
            // 仅记录日志，避免频繁通知；如需通知可解除注释
            // $notification && $notification.post && $notification.post(notifiTitle, "已自动移除 Smart App Banner", url);

            $done({
                headers,
                body
            });
        } else {
            console.log(`未检测到 Smart App Banner: url:${url}`);
            $done({});
        }
    }
}
