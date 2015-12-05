/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2015/12/3
 */

var requestHandlers = require("./requestHandlers");

var handle = {
    "/": requestHandlers.queryToSignIn,
    "/register": requestHandlers.getStaticPage,
    "/register/addUser": requestHandlers.addUser,
    "/static/css/form.css": requestHandlers.getStaticFile,
    "/static/css/details.css": requestHandlers.getStaticFile
};

function route (pathname, query, response) {
    console.log("About to route a request for " + pathname);
    if (typeof handle[pathname] === 'function') {
        handle[pathname](pathname, query, response);
    } else {
        console.log("No request handler found for " + pathname);
        // otherwise, return to register page
        response.writeHead(404, {'Content-Type': 'text/plain', 'charset':'utf-8'});
        response.write("本次作业，你应该访问/?username来登陆，或者访问/register来注册");
        response.end();
    }
}

exports.route = route;