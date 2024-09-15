let body = $response.body;

body = body.replace('<div id="reader-content"', 
                    '<div id="reader-content" style="position: absolute; left: 0; width: 100%;"');

body = body.replace('<button data-v-63a3e543="" class="bg-s-gray-100 w-28px h-28px rounded-1 flex items-center justify-center hover-24 active-10 p-0 absolute right-10px top-10px">',
                    '<button data-v-63a3e543="" class="bg-s-gray-100 w-100px h-100px rounded-1 flex items-center justify-center hover-24 active-10 p-0 absolute left-50vh top-50vh">');

body = body.replace('<span class="icon-close text-20px text-s-gray-400"></span>', 
                    '<span class="icon-close text-50px text-s-gray-400"></span>');

$done({ body });
