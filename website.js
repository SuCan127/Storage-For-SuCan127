let body = $response.body;
let headers = $response.headers;

// 删除 CSP 头部限制，绕过安全策略
headers['Content-Security-Policy'] = '';

// 在 <head> 标签后面插入 <meta> 标签
let reg = /<head>/;
let str = `<head>
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="viewport" content="user-scalable=no,initial-scale=1.0,maximum-scale=1.0" />
  <meta name="apple-mobile-web-app-title" content="调试1">
`;

body = body.replace(reg, str);

// 返回修改后的响应体和响应头
$done({body, headers});
