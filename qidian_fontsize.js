let body = $response.body;

body = body.replace('<div id="reader-content"', '<div id="reader-content" style="position: absolute; left: 0; width: 100%;"');

body = body.replace('<section data-v-63a3e543="" id="side-sheet" class="h-full"', '<section data-v-63a3e543="" id="side-sheet" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999;"');

body = body.replace('<div data-v-47ffe1ec class="pl-12px pb-136px z-4 absolute left-full pt-12px" id="r-menu"', '<div data-v-47ffe1ec id="r-menu" style="position: fixed; bottom: 0;"');

$done({ body });
