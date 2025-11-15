const method = $request.method; const url = $request.url; const status = $response.status; let headers = $response.headers || {}; let body = $response.body || ""; const notifiTitle = "移除Smart App Banner脚本";

// 仅处理 GET 且 HTML 响应（也可根据需要调整 status 检查） const contentType = (headers['Content-Type'] || headers['content-type'] || "").toLowerCase();

if (method !== "GET" || !contentType.includes("text/html")) { console.log(method:${method}, status:${status}, url:${url}, content-type:${contentType}); // 不强制通知，只在调试时打开此行： // $notification.post(notifiTitle, "跳过", "非 HTML 响应或非 GET 请求"); $done({ headers, body }); } else { // 如果响应被压缩（gzip/br/deflate），建议不在此脚本中解压处理 const contentEncoding = (headers['Content-Encoding'] || headers['content-encoding'] || "").toLowerCase(); if (contentEncoding && contentEncoding !== "identity") { console.log(响应已压缩，跳过处理: Content-Encoding=${contentEncoding}, url:${url}); $notification.post(notifiTitle, "跳过处理", 响应已压缩 (${contentEncoding})); $done({ headers, body }); }
// 匹配含有 name="apple-itunes-app"（属性值可能有单/双引号、顺序任意）的 <meta ...> 标签
// 使用前瞻确保只匹配 name=apple-itunes-app 的 meta 标签
const metaRegex = /<meta\b(?=[^>]*\bname\s*=\s*(?:["']?)apple-itunes-app(?:["']?))[^>]*>/gi;

const newBody = body.replace(metaRegex, "");
if (newBody === body) {
    console.log(`无需修改: 未发现 Smart App Banner meta 标签, url:${url}`);
    // 可选通知：
    // $notification.post(notifiTitle, "无需修改", "未发现 Smart App Banner meta 标签");
    $done({ headers, body });
} else {
    // 更新 Content-Length（如果存在）
    if (headers.hasOwnProperty('Content-Length') || headers.hasOwnProperty('content-length')) {
        try {
            const lengthKey = headers.hasOwnProperty('Content-Length') ? 'Content-Length' : 'content-length';
            // 尽量使用字节长度（utf-8）
            if (typeof Buffer !== "undefined") {
                headers[lengthKey] = Buffer.byteLength(newBody, 'utf8').toString();
            } else {
                // 回退到字符长度（大多数情况可用）
                headers[lengthKey] = newBody.length.toString();
            }
        } catch (e) {
            console.log("更新 Content-Length 失败:", e);
        }
    }
    console.log(`已移除 Smart App Banner meta 标签, url:${url}`);
    $notification.post(notifiTitle, "已移除 Smart App Banner", url);
    $done({ headers, body: newBody });
}
