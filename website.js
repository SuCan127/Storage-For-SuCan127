let body = $response.body;
let headers = $response.headers;

// 删除 CSP 头部限制，绕过安全策略
headers['Content-Security-Policy'] = '';

// 在 <head> 标签后面插入 <meta> 标签
let reg = /<head>/;
let str = `<head>
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no,viewport-fit=cover">

  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-touch-fullscreen" content="yes">
  <meta name="format-detection" content="telephone=no,email=no,address=no">
  <meta name="renderer" content="webkit">
  <meta name="HandheldFriendly" content="true">
  <meta name="MobileOptimized" content="320">
  <meta name="screen-orientation" content="portrait">
  <meta name="x5-orientation" content="portrait">
  <meta name="full-screen" content="yes">
  <meta name="x5-fullscreen" content="true">
  <meta name="browsermode" content="application">
  <meta name="x5-page-mode" content="app">
`;

body = body.replace(reg, str);

// 返回修改后的响应体和响应头
$done({body, headers});
