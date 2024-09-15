// Quantumult X script to insert CSS and JavaScript into the response HTML
let rHead = '<head>';
let newStyle = '<head><link rel="stylesheet" href="https://limbopro.com/CSS/baidu.zhidao.css" type="text/css">';
let rBody = '</body>';
let newJavaScript = '<script type="text/javascript" async="async" src="//limbopro.com/Adguard/baidu.zhidao.js"></script></body>';

// 确保 response.body 存在，并执行替换操作
if ($response.body) {
    // 将 <head> 标签替换为带有新样式表的内容
    let body = $response.body.replace(rHead, newStyle);
    
    // 将 </body> 标签替换为带有 JavaScript 的内容
    body = body.replace(rBody, newJavaScript);
    
    // 返回修改后的 body 内容
    $done({ body: body });
} else {
    // 如果没有 body 内容，则直接返回未修改的响应
    $done({});
}
