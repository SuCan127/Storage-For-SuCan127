'use strict';

const method = ($request && $request.method) || '';
const url = ($request && $request.url) || '';
const status = ($response && $response.status) || 0;
let headers = $response && $response.headers ? $response.headers : {};
let body = $response && $response.body ? $response.body : null;
const notifiTitle = "移除 Smart App Banner";

// 只在最常见的主页面 GET + 200 的 HTML 响应上尝试处理，避免对大量资源请求输出噪声
if (method !== "GET" || (status !== 200 && status !== 304 && status !== 206)) {
    // 非目标响应，静默放行（不通知、不打印大量日志）
    $done({ headers, body });
} else {
    const contentType = (headers['Content-Type'] || headers['content-type'] || "").toLowerCase();

    // 不是 HTML 则直接放行
    if (!body || contentType.indexOf("html") === -1) {
        $done({ headers, body });
    } else {
        try {
            // 如果响应被压缩（gzip/br/deflate），很多代理会自动解压并把 body 作为字符串传入。
            // 如果你的环境传入的是二进制/base64 或者 headers 有 Content-Encoding 并且无法解压，
            // 则本脚本无法处理，需要在代理端开启自动解压或在 mitm 中允许解压。
            const contentEncoding = (headers['Content-Encoding'] || headers['content-encoding'] || "").toLowerCase();
            if (contentEncoding && /(gzip|br|deflate)/i.test(contentEncoding)) {
                // 无自动解压时静默放行，并提示日志（避免频繁通知）
                console.log(`sab.js: 响应被压缩（${contentEncoding}），请启用代理的自动解压以便脚本生效。url:${url}`);
                $done({ headers, body });
                return;
            }

            const originalBody = body;

            // 1) 移除 meta name="apple-itunes-app" 标签（兼容单双引号或无引号）
            const metaRegex = /<meta\b[^>]*\bname\s*=\s*(?:"|')?apple-itunes-app(?:"|')?[^>]*>/gi;
            let cleaned = originalBody.replace(metaRegex, '');

            // 2) 移除常见的 Smart App Banner DOM（例如 class 或 id 包含 smartbanner / smart-app-banner 的容器）
            const smartDivRegex = /<(?:(?:div|section|header|aside|nav|span|article))\b[^>]*(?:class|id)\s*=\s*(?:"|')[^"']*(?:smartbanner|smart-app-banner|smartAppBanner|app-banner|appbanner|google-play-badge)[^"']*(?:"|')[^>]*>[\s\S]*?<\/(?:(?:div|section|header|aside|nav|span|article))>/gi;
            cleaned = cleaned.replace(smartDivRegex, '');

            // 3) 移除或屏蔽包含关键字的 script 片段（仅删除含有明显 banner 关键字的 script）
            cleaned = cleaned.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (match) => {
                if (/(smartbanner|smart-app-banner|apple-itunes-app|smart app banner|SmartAppBanner|smartAppBanner|appbanner|app-banner|openApp|downloadApp|open-in-app)/i.test(match)) {
                    return '';
                }
                return match;
            });

            // 4) 清理带有 smart banner 提示的注释
            cleaned = cleaned.replace(/<!--[\s\S]*?(smart app banner|smartbanner|smart-app-banner|open app|download app)[\s\S]*?-->/gi, '');

            if (cleaned === originalBody) {
                // 页面未改动，静默放行
                $done({ headers, body });
            } else {
                // 更新 Content-Length（尽量按 UTF-8 字节长度计算）
                try {
                    const byteLen = (typeof TextEncoder !== "undefined")
                        ? new TextEncoder().encode(cleaned).length
                        : unescape(encodeURIComponent(cleaned)).length;
                    headers['Content-Length'] = String(byteLen);
                    // 如果存在 Content-Encoding，移除它（因为我们处理后的 body 应为未压缩文本）
                    delete headers['Content-Encoding'];
                } catch (e) {
                    headers['Content-Length'] = String(cleaned.length);
                }

                console.log(`sab.js: 已移除 Smart App Banner 相关元素，url:${url}`);
                // 仅在成功移除时通知（避免频繁通知）
                $notification && $notification.post && $notification.post(notifiTitle, "移除成功", url);
                $done({ headers, body: cleaned });
            }
        } catch (err) {
            console.log(`sab.js: 处理异常: ${err}, url:${url}`);
            $notification && $notification.post && $notification.post(notifiTitle, "处理异常", String(err));
            $done({ headers, body });
        }
    }
}
