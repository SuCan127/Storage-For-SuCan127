const method = $request.method;
const url = $request.url;
const status = $response.status;
let headers = $response.headers;
let body = $response.body;
const notifiTitle = "移除 Smart App Banner";

if (method !== "GET" || (status !== 200 && status !== 304)) {
    console.log(`method:${method},status:${status},url:${url}`);
    $notification.post(notifiTitle, "method/status 有误", `method:${method}, status:${status}`);
    $done({ headers, body });
} else {
    const contentType = (headers['Content-Type'] || headers['content-type'] || "").toLowerCase();
    if (!body || contentType.indexOf("html") === -1) {
        console.log(`非 HTML 响应或无 body，跳过处理。url:${url}`);
        $done({ headers, body });
    } else {
        // 删除 <meta name="apple-itunes-app" ...>，兼容多种写法（单双引号或无引号）
        const originalBody = body;
        const removedMetaBody = body.replace(
            /<meta\b[^>]*\bname\s*=\s*(?:"apple-itunes-app"|'apple-itunes-app'|apple-itunes-app)\b[^>]*>/gi,
            ""
        );

        // 另外尝试去掉页面里可能的 Smart App Banner 相关字符串或注入脚本（保守处理，仅删除常见标记/注释）
        const cleanedBody = removedMetaBody
            .replace(/<!--[\s\S]*?smart app banner[\s\S]*?-->/gi, "") // 清理包含 smart app banner 的注释（若存在）
            .replace(/window\.navigator\.standalone\s*=/gi, "window.navigator._standalone_disabled="); // 最小侵入式改写（防止部分 banner 脚本触发）

        if (cleanedBody === originalBody) {
            console.log(`未发现 apple-itunes-app meta，页面无需修改。url:${url}`);
            $done({ headers, body });
        } else {
            // 更新 Content-Length（尽量准确处理 UTF-8）
            try {
                const byteLen = (typeof TextEncoder !== "undefined")
                    ? new TextEncoder().encode(cleanedBody).length
                    : unescape(encodeURIComponent(cleanedBody)).length;
                headers['Content-Length'] = String(byteLen);
            } catch (e) {
                headers['Content-Length'] = String(cleanedBody.length);
            }

            console.log(`已移除 Smart App Banner/meta，url:${url}`);
            $notification.post(notifiTitle, "移除成功", url);
            $done({ headers, body: cleanedBody });
        }
    }
}
