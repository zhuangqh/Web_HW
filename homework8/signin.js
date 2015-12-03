/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2015/12/3
 */

var http = require("http");
var url = require("url");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var PORT = 8000;

var handle = {};
handle["/"] = requestHandlers.queryToSignIn;
handle["/static/css/form.css"] = requestHandlers.getStaticFile;

function onRequest (req, res) {
    var pathname = url.parse(req.url).pathname;
    var query = url.parse(req.url, true).query;
    console.log("Request for " + pathname + " received");
    router.route(handle, pathname, query, res);
}

http.createServer(onRequest).listen(PORT);

console.log("Server has started running at " + PORT + "port.");