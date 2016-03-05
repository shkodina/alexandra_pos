var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

//***********************************************************
//***********************************************************
//
//		A P P
//
//***********************************************************
//***********************************************************


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(express.static(path.join(__dirname, 'public/my/02')));
//app.use(express.static(path.join(__dirname, 'public/my/03')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//***********************************************************
//***********************************************************
//
//		H T T P
//
//***********************************************************
//***********************************************************


var debug = require('debug')('app2:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
//***********************************************************
//***********************************************************
//
//		 M Y   S E R V E R
//
//***********************************************************

var saleserver = require("./saleserver.js");


//***********************************************************
//***********************************************************
//
//		 S O C K E T . I O
//
//***********************************************************

var io = require('socket.io')(server);

io.on('connection', function (socket) {

    socket.on('addCoffee', function (msg) {
        saleserver.addCoffe(msg);
    });
    socket.on('updateCoffee', function (msg) {
        saleserver.updateCoffee(msg);
    });




    socket.on('sayOK', function (msg) {
        console.log("from sayOK start");
        console.log(msg);
        console.log("from sayOK stop");
        io.emit('printMyData', {i: 10, t: 100});
//        tools.buttons.add(msg.groupId, msg.button);
//        io.emit('updateGroups', groups);
    });

});

///////////////////////////////////////
//***********************************************************
//***********************************************************


var fs = require('fs');

setInterval(function () {

    try{
        io.emit('printMeas', JSON.parse(fs.readFileSync('./message.json')));
    }catch (error){
        console.log("From parser error", error);
    }

}, 2500);

module.exports = app;