var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

var postObjectAPI = require('./routes/post-object.js');
app.use('/post-object', postObjectAPI);

var getObjectAPI = require('./routes/get-object.js');
app.use('/get-object', getObjectAPI);

const server = app.listen(80, function () {
    const host = server.address().address
    const port = server.address().port

    console.log("Server listening at http://%s:%s", host, port)
})