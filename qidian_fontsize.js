let body = $response.body;

// 插入 viewport 元标签，使得页面在手机上适配
let newViewport = `
<meta name="viewport" content="width=device-width, initial-scale=1.5, user-scalable=no">
`;

// 将 viewport 元标签插入到 <head> 标签中
body = body.replace(/<head>/, `<head>${newViewport}`);

$done({ body });
