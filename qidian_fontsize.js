let reg = '<div id="right-container" class="h-100vh fixed top-0 flex items-end z-2 transition-transform duration-300" style="left: 1363px;">';
let newDiv = '<div id="right-container" class="h-100vh fixed top-0 flex items-end z-2 transition-transform duration-300" style="left: 0; width: 120%; height: 120%;">';

// 替换响应体中的原始 `#right-container` 容器，增加其宽度和高度
if ($response.body) {
    let body = $response.body.replace(reg, newDiv);
    $done({ body });
} else {
    let body = $response.body.replace(reg, newDiv);
    $done({ body });
}
