'use strict';

const method = $request.method;
const url = $request.url;
const status = $response.status;
let headers = $response.headers;
let body = $response.body;
const notifiTitle = "移除 Smart App Banner";

if (method !== "GET" || (status !== 200 && status !== 304)) {
    // 非预期的请求类型或状态码，按模板风格提示并放行不改动
    console.log(`method:${method},status:${status},url:${url}`);
    $notification.post(notifiTitle, "method/status 有误", `method:${method}, status:${status}`);
    $done({ headers, body });
} else {
    // 检查是否为 HTML 响应
    const contentType = (headers['Content-Type'] || headers['content-type'] || "").toLowerCase();
    if (!body || contentType.indexOf("html") === -1) {
        console.log(`非 HTML 响应或无 body，跳过处理。url:${url}`);
        $done({ headers, body });
    } else {
        try {
            const originalBody = body;

            // 1) 移除 meta name="apple-itunes-app" 标签（兼容单双引号或无引号）
            const metaRegex = /<meta\b[^>]*\bname\s*=\s*(?:"|')?apple-itunes-app(?:"|')?[^>]*>/gi;
            let cleaned = originalBody.replace(metaRegex, '');

            // 2) 移除常见的 Smart App Banner DOM（例如 class 或 id 包含 smartbanner / smart-app-banner 的容器）
            const smartDivRegex = /<(?:(?:div|section|header|aside|nav|span|article))\b[^>]*(?:class|id)\s*=\s*(?:"|')[^"']*(?:smartbanner|smart-app-banner|smartAppBanner)[^"']*(?:"|')[^>]*>[\s\S]*?<\/(?:(?:div|section|header|aside|nav|span|article))>/gi;
            cleaned = cleaned.replace(smartDivRegex, '');

            // 3) 移除或屏蔽包含关键字的脚本片段（仅删除含有明显 banner 关键字的 script）
            cleaned = cleaned.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (match) => {
                // 若脚本内容中包含这些关键字，认为与 Smart App Banner 相关，删除该 script 标签
                if (/(smartbanner|smart-app-banner|apple-itunes-app|smart app banner|SmartAppBanner|smartAppBanner)/i.test(match)) {
                    return '';
                }
                return match;
            });

            // 4) 清理带有 smart banner 提示的注释
            cleaned = cleaned.replace(/<!--[\s\S]*?(smart app banner|smartbanner|smart-app-banner)[\s\S]*?-->/gi, '');

            if (cleaned === originalBody) {
                console.log(`未发现 Smart App Banner 相关内容，页面无需修改。url:${url}`);
                $done({ headers, body });
            } else {
                // 更新 Content-Length，尽量按 UTF-8 字节长度计算
                try {
                    const byteLen = (typeof TextEncoder !== "undefined")
                        ? new TextEncoder().encode(cleaned).length
                        : unescape(encodeURIComponent(cleaned)).length;
                    headers['Content-Length'] = String(byteLen);
                } catch (e) {
                    headers['Content-Length'] = String(cleaned.length);
                }

                console.log(`已移除 Smart App Banner 相关元素，url:${url}`);
                $notification.post(notifiTitle, "移除成功", url);
                $done({ headers, body: cleaned });
            }
        } catch (err) {
            // 出现异常时放行原始响应并上报错误
            console.log(`处理异常: ${err}, url:${url}`);
            $notification.post(notifiTitle, "处理异常", String(err));
            $done({ headers, body });
        }
    }
}
