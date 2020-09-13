let http = require('http');
let fs = require('fs');
let url = require('url');
let qs = require('querystring');
// 모듈

function templtaeHTML(title, list, body, control)
{
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist)
{
  let list = '<ul>';
  for(let i = 0; i < filelist.length; i++)
  {
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
  }
  list += '</ul>';
  return list;
}

let app = http.createServer(function(request, response){
    let _url = request.url;
    let queryData = url.parse(_url, true).query;
    let pathname = url.parse(_url, true).pathname;
    if(pathname === '/') // pathname은 페이지와 홈을 구분 할 수 없다
    {
      if(queryData.id === undefined)
      {
        fs.readdir('./data', (error, filelist) => // Read
        {
          let title = "Welcome";
          let description = "Node.js";
          let list = templateList(filelist);
          let template = templtaeHTML(title, list, `<h2>${title}</h2><p>${description}</p>`, `<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(template);
        });
      }
      else
      {
        fs.readdir('./data', (error, filelist) =>
        {
          fs.readFile(`./data/${queryData.id}`, 'utf8' ,(err, description) =>
          {
            let title = queryData.id;
            let list = templateList(filelist);
            let template = templtaeHTML(title, list, `<h2>${title}</h2><p>${description}</p>`, `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    }
    else if(pathname === '/create')
    {
      fs.readdir('./data', (error, filelist) =>
      {
        let title = "Web - create";
        let list = templateList(filelist);
        let template = templtaeHTML(title, list, `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `, '');
        response.writeHead(200);
        response.end(template);
      });
    }
    else if(pathname === '/create_process') /// Create process
    {
      let body = '';
      request.on('data', (data) =>
      {
        body += data;
      });
      request.on('end', () =>
      {
        let post = qs.parse(body);
        let title = post.title;
        let description = post.description
        fs.writeFile(`data/${title}`, description, 'utf8', (err) =>
        {
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end("success");
        });
      });
    }
    else if(pathname === '/update') // Update
    {
      fs.readdir('./data', (error, filelist) =>
      {
        fs.readFile(`./data/${queryData.id}`, 'utf8' ,(err, description) =>
        {
          let title = queryData.id;
          let list = templateList(filelist);
          let template = templtaeHTML(title, list, `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `, `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
          response.writeHead(200);
          response.end(template);
        });
      });
    }
    else if(pathname === '/update_process') // Update process
    {
      let body = '';
      request.on('data', (data) =>
      {
        body += data;
      });
      request.on('end', () =>
      {
        let post = qs.parse(body);
        let id = post.id;
        let title = post.title;
        let description = post.description
        fs.rename(`./data/${id}`, `./data/${title}`, (error) =>
        {
          fs.writeFile(`data/${title}`, description, 'utf8', (err) =>
          {
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end("success");
          });
        });
      });
    }
    else
    {
      response.writeHead(404);
      response.end("Not found...");
    }
});
app.listen(3000);