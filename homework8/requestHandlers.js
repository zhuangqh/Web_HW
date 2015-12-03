/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2015/12/3
 */

var fs = require('fs');
var path = require('path');

function queryToSignIn (pathname, query, response) {

}

function getStaticFile(pathname, query, response) {
    var ext = path.extname(pathname); // 文件拓展名
    ext = ext.slice(1); // 去掉小点
    // mime 映射表
    var mime = {
        "css": "text/css",
        "js": "text/javascript"
    };

    fs.readFile(path.join(__dirname, pathname), "binary", function (err, file) {
        if (err) {
            response.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            response.end();
        } else {
            response.writeHead(200, {
                'Content-Type': mime[ext]
            });
            response.write(file, "binary");
            response.end();
        }
    });
}

exports.getStaticFile = getStaticFile;
exports.queryToSignIn = queryToSignIn;