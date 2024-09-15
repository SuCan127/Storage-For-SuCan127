let body = $response.body;

body = body.replace('<div id="reader-content"', 
                    '<div id="reader-content" style="position: absolute; left: 0; width: 100%;"');

body = body.replace('<button data-v-63a3e543="" class="bg-s-gray-100 w-28px h-28px rounded-1 flex items-center justify-center hover-24 active-10 p-0 absolute right-10px top-10px">',
                    '<button data-v-63a3e543="" class="bg-s-gray-100 flex items-center justify-center hover-24 active-10 p-0" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100px; height: 100px; border-radius: 50px;">');

body = body.replace('<span class="icon-close text-20px text-s-gray-400"></span>', 
                    '<span class="icon-close text-50px text-s-gray-400"></span>');

$done({ body });
