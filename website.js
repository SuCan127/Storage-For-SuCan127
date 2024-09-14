let body = $response.body;
let headers = $response.headers;

// 删除 CSP 头部限制
headers['Content-Security-Policy'] = '';

// 在 <head> 标签后面插入 <meta> 标签和脚本
let reg = /<head>/;
let str = `<head>
  <meta name="apple-mobile-web-app-title" content="山无涯">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="format-detection" content="telephone=no">
  <meta name="viewport" content="width=device-width,initial-scale=1, minimum-scale=1.0, maximum-scale=1, user-scalable=no">
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      // 强制让内容高度超过窗口高度
      $('div').css("height", window.innerHeight + 100);  // 初始高度超过视窗高度

      // 滚动页面，隐藏 Safari 工具栏
      window.scrollTo(0, 1);

      // 重置为新的高度
      $("div").css("height", window.innerHeight);  // 设置为视窗高度

      // 禁止页面滑动
      document.addEventListener('touchmove', function (e) {
        e.preventDefault();
      }, false);
    });
  </script>
`;

body = body.replace(reg, str);

// 返回修改后的响应体和响应头
$done({body, headers});
