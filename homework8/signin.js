/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2015/12/3
 */

var http = require("http");
var url = require("url");
var querystring = require("querystring");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var PORT = 8000;

function onRequest (req, res) {
    var postData = "";

    if (req.method == "GET") {
        var pathname = url.parse(req.url).pathname;
        var query = url.parse(req.url, true).query;
        console.log("Request for " + pathname + " received");
        router.route(pathname, query, res);
    } else if (req.method == "POST") {
        // 接收小包数据
        req.addListener("data", function (postDataChunk) {
            postData += postDataChunk;
        });

        req.addListener("end", function () {
            var oPostData = querystring.parse(postData);
            requestHandlers.addUser(oPostData, res);
        });
    }
}

http.createServer(onRequest).listen(PORT);

console.log("Server has started running at " + PORT + " port.");