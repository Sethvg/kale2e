var test = require('../kale2e.js').steps;
var http = require('http');
var query = require('querystring');

var host = test.prefVars.host;
var path = test.prefVars.path;
var port = test.prefVars.port;


//////////////////////////////////////////////////////////////

var username;
var password;
var loggedIn;

test.init(function () {
    loggedIn = false;
    username = '';
    password = '';
});

test.then(/I should be logged in/, function () {
    test.assertTrue(loggedIn);
});

test.then(/I should not be logged in/, function () {
    test.assertFalse(loggedIn);
});

test.when(/I log in with the username (.*) and password (.*)/,
    function (uname, pw) {
    loggedIn = false;
    var body = query.stringify({username: uname, password: pw});
    var post_options = {
        host: host,
        port: port,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(body)
        }
    };

    var abort = false;
    var post_req = http.request(post_options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            if (!abort) {
                handleResponse(chunk, res);
                test.resume();
            }
        });
    });
    post_req.write(body);
    post_req.end();

    test.wait(3, function () {
        abort = true;
    })
});


test.then(/Fail/, function () {
    test.fail();
})


function setLoggedIn(b) {
    loggedIn = b;
}


function handleResponse(data, res) {
    d = JSON.parse(data);
    if (res.statusCode == 200 && d.msg == "Valid Credentials") {
        setLoggedIn(true);
    }
}


module.exports = test;
