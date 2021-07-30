// Web Server的最基本构成
// 1.处理HTTP：对HTTP的动词（GET/POST/PUT）进行相应
// 2.路由管理：分别处理不同URL路径的请求，返回对应的网络资源
// 3.静态文件托管：对网络请求的静态资源进行响应或使用模板动态响应请求
// 4.文件数据存储：将请求携带的数据存储到文件或者数据库中

const http = require('http');
const url = require('url');// 方便获取路径
const path = require('path');// 路径拼接，解决/问题
const fs = require('fs');// 文件系统模块
const qs = require('querystring');// 处理路径参数
const notFound = (req, res) => {
    fs.readFile(path.join(__dirname, '404.html'), (err, data) => {
        if (err) {
            res.write(404, 'not Found');
        } else {
            res.writeHead(400, { 'Content-Type': "text/html;charset='utf-8'" });
            res.write(data);
            res.end();
        }
    })
}

const writeDb = chunk => {
    fs.appendFile(path.join(__dirname, 'db'), chunk, err => {
        if (err) throw err;
        console.log("db insert", chunk);
    })
}
http.createServer((req, res) => {

    let requestUrl = url.parse(req.url);
    let pathname = requestUrl.pathname;

    // 接口请求
    if (pathname.startsWith("/api")) {
        // 处理http动词请求
        let method = req.method;
        if (method === "GET") {
            const query = qs.parse(requestUrl.query);
            const resData = {
                status: 200,
                msg: "success",
                data: query
            }
            writeDb(JSON.stringify(resData));
            res.end(JSON.stringify(resData));
            return;
        }
        if (method === "POST") {
            const contentType = req.headers['content-type'];
            if (contentType === 'application/json') {
                let postData = '';
                req.on('data', chunk => {
                    postData += chunk;
                    writeDb(chunk);
                })
                req.on('end', () => {
                    res.end(postData);
                })
            }
            return;
        }
    }

    if (pathname == "/") {
        pathname = path.join(__dirname, 'index.html');
    }
    // 获取后缀名
    const extName = path.extname(pathname);
    if (extName === ".html") {
        fs.readFile(pathname, (err, data) => {
            if (err) {
                notFound(req, res);
            } else {
                res.writeHead(200, { 'Content-Type': "text/html;charset='utf-8'" });
                res.write(data);
                res.end();
            }
        })
    }
}).listen(8080)