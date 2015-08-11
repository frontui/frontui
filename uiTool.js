
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

/* 启动浏览器 */
var openURL = function (url) {
    switch (process.platform) {
        case "darwin":
            exec('open ' + url);
            break;
        case "win32":
            exec('start ' + url);
            break;
        default:
            spawn('xdg-open', [url]);
    }
}

module.exports = {
	openURL: openURL
}