/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2015/12/3
 */

var jade = require('jade');

function route (handle, pathname, query, response) {
    console.log("About to route a request for " + pathname);
    if (typeof handle[pathname] === 'function') {
        handle[pathname](pathname, query, response);
    } else {
        console.log("No request handler found for " + pathname);
        // otherwise, return to register page
        jade.renderFile('./views/register.jade', function (err, html) {
            response.writeHead(200, {"Content-Type": "text/html"});
            response.end(html);
        });
    }
}

exports.route = route;