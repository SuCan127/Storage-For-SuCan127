let body = $response.body;

// 1. 当 <section id="side-sheet"> 打开时铺满整个页面
body = body.replace('<section data-v-63a3e543="" id="side-sheet" class="h-full"', 
                    '<section data-v-63a3e543="" id="side-sheet" class="h-full" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999;"');

// 2. 将 <div class="h-full w-400px"> 容器固定到屏幕底部
body = body.replace('<div data-v-63a3e543="" class="h-full w-400px relative"', 
                    '<div data-v-63a3e543="" class="h-full w-400px" style="position: fixed; bottom: 0; width: 100%; max-width: 400px;"');

// 3. 固定 #r-menu 到屏幕底部，保持其在容器内部
body = body.replace('<div data-v-47ffe1ec class="pl-12px pb-136px z-4 absolute left-full pt-12px" id="r-menu"',
                    '<div data-v-47ffe1ec class="pl-12px pb-136px z-4" id="r-menu" style="position: fixed; bottom: 0; left: 0; width: 100%; max-width: 400px;"');

$done({ body });
