let body = $response.body;

// 插入样式标签，修改字体大小为21px
let newStyle = `
<style>
  body {
    font-size: 21px !important;
  }
</style>
`;

// 将样式插入到 <head> 标签中
body = body.replace(/<head>/, `<head>${newStyle}`);

$done({ body });
