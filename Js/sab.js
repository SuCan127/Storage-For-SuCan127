const method = $request.method;
const url = $request.url;
const status = $response.status;
let headers = $response.headers;
let body = $response.body;
const notifiTitle = "移除 Smart App Banner";

if (method !== "GET" || status !== 200 || !headers || !headers['Content-Type'] || headers['Content-Type'].indexOf('text/html') === -1) {
    console.log(`method:${method}, status:${status}, url:${url}`);
    $notification.post(notifiTitle, "跳过处理", "非 HTML 响应或方法/状态不匹配");
    $done({ headers, body });
} else {
    // 正则：匹配任意包含 name="apple-itunes-app"（属性顺序不限、单双引号兼容）的 meta 标签
    const metaPattern = /<meta\b[^>]*\bname\s*=\s*(['"]?)apple-itunes-app\1[^>]*>/gi;
    const matches = body.match(metaPattern);
    if (!matches || matches.length === 0) {
        console.log('未找到 apple-itunes-app meta 标签， 无需修改');
        $notification.post(notifiTitle, "未找到", "页面中没有 smart app banner meta 标签");
        $done({ headers, body });
    } else {
        const removedCount = matches.length;
        body = body.replace(metaPattern, '');
        // 删除 Content-Length 以避免长度不一致的问题，代理/客户端 会重写或忽略该字段
        if (headers.hasOwnProperty('Content-Length')) delete headers['Content-Length'];
        if (headers.hasOwnProperty('content-length')) delete headers['content-length'];
        console.log(`已移除 ${removedCount} 个 apple-itunes-app meta 标签, url:${url}`);
        $notification.post(notifiTitle, "已移除", `移除了 ${removedCount} 个 Smart App Banner 元素`);
        $done({ headers, body });
    }
}
