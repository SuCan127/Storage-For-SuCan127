// Pixiv PC User-Agent 替换脚本

// 确认当前请求是否为 Pixiv 相关的 tags 和 artworks 页面
if ($request.url.includes("/tags/") && $request.url.includes("/artworks")) {
    // 克隆当前请求头
    let modifiedHeaders = Object.assign({}, $request.headers);
    
    // 修改 User-Agent 为桌面版
    modifiedHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36';

    // 返回修改后的请求信息
    $done({ headers: modifiedHeaders });
} else {
    // 如果 URL 不符合要求，直接不做修改
    $done({});
}
