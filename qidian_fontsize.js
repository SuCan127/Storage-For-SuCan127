let body = $response.body;

// 隐藏第一个容器
body = body.replace('<div id="left-container"', '<div id="left-container" style="display: none;"');

// 将第二个容器移到最左边
body = body.replace('<div id="reader-content"', '<div id="reader-content" style="position: absolute; left: 0; width: 100%;"');

// 将第三个容器覆盖整个页面
body = body.replace('<div id="right-container"', '<div id="right-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"');

$done({ body });
