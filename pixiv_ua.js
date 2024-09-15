// Pixiv PC User-Agent 替换脚本

// 检查请求的 URL 是否匹配
if ($request.url.indexOf("/tags/") !== -1 && $request.url.indexOf("/artworks") !== -1) {
    // 替换 User-Agent 为桌面版的
    var modifiedHeaders = $request.headers;
    modifiedHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36';

    // 返回新的请求信息
    $done({ headers: modifiedHeaders });
} else {
    // 如果 URL 不匹配则不做任何修改
    $done({});
}
