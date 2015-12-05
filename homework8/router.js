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
    "/static/css/details.css": requestHandlers.getStaticFile,
    "/static/js/reminder.js": requestHandlers.getStaticFile,
    "/static/js/jQuery.js": requestHandlers.getStaticFile
};

function route (pathname, query, response) {
    console.log("About to route a request for " + pathname);
    if (typeof handle[pathname] === 'function') {
        handle[pathname](pathname, query, response);
    } else {
        console.log("No request handler found for " + pathname);
        requestHandlers.pageNotFound(response);
    }
}

exports.route = route;