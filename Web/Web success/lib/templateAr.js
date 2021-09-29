module.exports = {
  HTML:function(body){
    return `
    <!doctype html>
    <html>
    <head>
      <title>Arudino</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1>Arudino</h1>
      ${body}
    </body>
    </html>
    `;
  }
}
