let body = $response.body;
let headers = $response.headers;

headers['Content-Security-Policy'] = '';

let reg = /<head>/;
let str = `<head>
  <meta name="apple-mobile-web-app-title" content="山无涯">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="format-detection" content="telephone=no">
  <meta name="viewport" content="width=device-width,initial-scale=1, minimum-scale=1.0, maximum-scale=1, user-scalable=no">
`;

body = body.replace(reg, str);

// 返回修改后的响应体和响应头
$done({body, headers});
