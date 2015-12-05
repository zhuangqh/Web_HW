/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2015/12/3
 */

var fs = require('fs');
var path = require('path');
var jade = require('jade');

function queryToSignIn (pathname, query, response) {
    var redirectToRegister = function () { // 跳转至注册页面
        response.writeHead(302, {
            'Location': '/register'
        });
        response.end();
    };

    if (!query) { // 无查询内容，跳转至注册页面
        redirectToRegister();
    } else {
        fs.readFile("./userList.txt", function (err, data) {
            if (err) {throw err;}

            var re = new RegExp("\{\"username\":\"" + query.username + "\"[@,\.\":\\w\\d]*\}");
            var record = re.exec(data.toString());

            if (!record) { // 用户未注册
                redirectToRegister();
            } else {
                jade.renderFile("./views/userInfo.jade", JSON.parse(record[0]), function (err, html) {
                    if (err) {throw err;}
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.end(html);
                });
            }
        });
    }
}

function addUser(oPostData, response) {
    console.log("About to add user");
    var userInfo = [oPostData.username, oPostData.studentId,
        oPostData.phone, oPostData.mail];

    var duplicate = [];
    var keys = ["username", "studentId", "phone", "mail"];
    var map = {
        'username': '用户名',
        'studentId': '学号',
        'phone': '电话',
        'mail': '邮箱'
    };
    fs.readFile("./userList.txt", function (err, data) {
        if (err) {throw err;}

        // 查询是否有重复
        userInfo.forEach(function (element, index) {
            var strToMatch = "\"" + keys[index] + "\":\"" + userInfo[index] + "\"";
            if (data.toString().indexOf(strToMatch) != -1)
                duplicate.push(map[keys[index]]);
        });

        if (!duplicate.length) {
            fs.appendFile("./userList.txt", JSON.stringify(oPostData), function (err) {
                if (err) {throw err;}
            });

            response.writeHead(302, {    //  用户已注册，跳转至详情页
                'Location': '/?username=' + oPostData.username
            });
            response.end();
        } else {
            // 显示重复的信息
            jade.renderFile("./views/registerError.jade", {errorMessage: duplicate}, function (err, html) {
                if (err) {throw err;}

                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(html);
            });
        }
    });
}

// 获取静态css, js文件
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

// 渲染静态html
function getStaticPage(filename, query, response) {
    jade.renderFile('./views/' + filename + '.jade', function (err, html) {
        if (err) {throw err;}
        response.writeHead(200, {"Content-Type": "text/html"});
        response.end(html);
    });
}

// 404 指引页面
function pageNotFound(response) {
    jade.renderFile('./views/404.jade', function (err, html) {
        if (err) {throw err;}
        response.writeHead(404, {"Content-Type": "text/html"});
        response.end(html);
    });
}

exports.getStaticFile = getStaticFile;
exports.queryToSignIn = queryToSignIn;
exports.addUser = addUser;
exports.getStaticPage = getStaticPage;
exports.pageNotFound = pageNotFound;