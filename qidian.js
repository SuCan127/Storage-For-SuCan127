let body = $response.body;

body = body.replace('<div id="reader-content"', 
                    '<div id="reader-content" style="position: absolute; left: 0; width: 100%;"');

body = body.replace('<div id="right-container"', 
                    '<div id="right-container" style="position: absolute; left: 0; width: 100%;"');

$done({ body });
