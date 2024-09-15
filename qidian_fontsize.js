let body = $response.body;

// 添加 CSS 规则，针对手机进行页面布局调整
let mobileStyle = `
<style>
  body {
    font-size: 20px !important;
    line-height: 1.6 !important;
    padding: 10px !important;
  }
  /* 调整评论区的显示 */
  .comment-section {
    font-size: 18px !important;
  }
  /* 让整体页面更适应手机 */
  * {
    max-width: 100% !important;
    word-wrap: break-word !important;
  }
</style>
`;

// 将样式插入到 <head> 标签中
body = body.replace(/<head>/, `<head>${mobileStyle}`);

$done({ body });
