let body = $response.body;
let headers = $response.headers;

// 删除 CSP 头部限制，绕过安全策略
headers['Content-Security-Policy'] = '';

// 在 <head> 标签后面插入 <meta> 标签和处理链接跳转的 JavaScript
let reg = /<head>/;
let str = `<head>
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="viewport" content="user-scalable=no,initial-scale=1.0,maximum-scale=1.0" />
  <meta name="apple-mobile-web-app-title" content="调试1">
  <script>
    // 防止 Safari 工具栏弹出并处理链接行为
    document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('a').forEach(link => {
        link.addEventListener('touchstart', function(event) {
          event.preventDefault(); // 阻止默认的链接行为，包括工具栏的显示
          setTimeout(() => {
            window.location.href = link.href; // 在当前 WebApp 中导航到新页面
          }, 100); // 添加轻微的延迟避免刷新错误
        });
      });
    });
  </script>
`;

body = body.replace(reg, str);

// 返回修改后的响应体和响应头
$done({body, headers});
