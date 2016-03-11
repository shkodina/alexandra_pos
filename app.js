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
app.use(bodyParser.urlencoded({
    extended: false
}));
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
//***********************************************************

var saleserver = require("./saleserver.js");

//***********************************************************
//***********************************************************
//
//		 M A I L S E N D E R
//
//***********************************************************
//***********************************************************


var mailsender = require("./mymodules/mailsender");
mailsender.init();

//***********************************************************
//***********************************************************
//
//		 B A C K U P E R
//
//***********************************************************
//***********************************************************


var backuper = require("./mymodules/backuper");
backuper.init();



//***********************************************************
//***********************************************************
//
//		 S O C K E T . I O
//
//***********************************************************
//***********************************************************

var io = require('socket.io')(server);

io.on('connection', function (socket) {

    socket.on('updateAdminFromDB', function (msg) {
        console.log('ask updateAdminFromDB with msg = ', msg);
        saleserver.getAllDrinksByType(msg.type, function (docs) {
            socket.emit('setAdminListFromDB', docs);
        });
    });

    //**********************************************************
    //**********************************************************
    //
    //    D R I N K S
    //
    //**********************************************************
    //**********************************************************

    socket.on('addCurDrinkToDB', function (msg) {
        console.log(msg);
        saleserver.addDrink(msg);
    });

    socket.on('deleteCurDrinkFromDB', function (msg) {
        console.log(msg);
        saleserver.deleteDrink(msg);
    });

    //**********************************************************
    //**********************************************************
    //
    //    G R O U P S
    //
    //**********************************************************
    //**********************************************************


    socket.on('addNewGroupToDB', function (msg) {
        console.log(msg);
        saleserver.addNewGroup(msg);
    });

    socket.on('getAllGroupsFromDB', function (msg) {
        console.log("ask all groups from db");
        console.log(msg);
        saleserver.getAllGroups(function (docs) {
            socket.emit('setGroupsFromDB', docs);
        });
    });


    //**********************************************************
    //**********************************************************
    //
    //    I N G R I D I E N T S
    //
    //**********************************************************
    //**********************************************************


    socket.on('getAllIngridientsFromDB', function (mes) {
        console.log("ask getAllIngridientsFromDB");
        console.log(mes);
        saleserver.getAllIngridients(function (docs) {
            socket.emit('setAllIngridientsFromDB', docs);
        });
    });

    socket.on('getAllIngridientsMassFromDB', function (mes) {
        console.log("ask getAllIngridientsFromDB");
        console.log(mes);
        saleserver.getAllIngridientsMass(function (docs) {
            socket.emit('setAllIngridientsMassFromDB', docs);
        });
    });


    socket.on('addIngridientToDB', function (mes) {
        console.log('ask add new ing to DB');
        console.log(mes);
        saleserver.addIngridient(mes);
    });

    socket.on('deleteIngridientFromDB', function (mes) {
        console.log('ask delete ingridient in DB');
        console.log(mes);
        saleserver.deleteIngridient(mes);
    });

    socket.on('updateIngridientInDB', function (mes) {
        console.log('ask update ingridient in DB');
        console.log(mes);
        saleserver.updateIngridient(mes);
    });

    //**********************************************************
    //**********************************************************
    //
    //    M A I N    A N D    C H E C K
    //
    //**********************************************************
    //**********************************************************

    socket.on('updateMainFromDB', function (msg) {
        saleserver.getAllDrinksByType(null, function (docs) {
            socket.emit('setMainDrinkListFromDB', docs);
        });


    });

    socket.on('addCheckToDB', function (mes) {
        saleserver.addCheckToDB(mes);
        saleserver.updateIngridientsByCheck(mes);
        saleserver.updateKassaByCheck(mes);
        saleserver.getCurrentMoneyValueFromKassa(function (money) {
            socket.emit('updateManeyValueFromDB', money);
        });
    });


    //**********************************************************
    //**********************************************************
    //
    //    K A S S A
    //
    //**********************************************************
    //**********************************************************

    socket.on('getMoneyFromKassa', function (mes) {
        console.log('ask getMoneyFromKassa');
        console.log(mes);
        saleserver.getMoneyFromKassa(mes);
        saleserver.getCurrentMoneyValueFromKassa(function (money) {
            socket.emit('updateManeyValueFromDB', money);
        });
    });

    socket.on('addMoneyToKassa', function (mes) {
        console.log('ask addMoneyToKassa');
        console.log(mes);
        saleserver.addMoneyToKassa(mes);
        saleserver.getCurrentMoneyValueFromKassa(function (money) {
            socket.emit('updateManeyValueFromDB', money);
        });
    });

    socket.on('getCurrentMoneyFromKassa', function (mes) {
        saleserver.getCurrentMoneyValueFromKassa(function (money) {
            socket.emit('updateManeyValueFromDB', money);
        });
    });


    //**********************************************************
    //**********************************************************
    //
    //    C O N F I G U R A T O R
    //
    //**********************************************************
    //**********************************************************

    socket.on('addNewConfigParamToDB', function (mes) {
        saleserver.addNewConfigParamToDB(mes);
    });

    socket.on('updateConfigParamToDB', function (mes) {
        saleserver.updateConfigParamToDB(mes);
    });

    socket.on('getAllConfigParams', function (mes) {
        saleserver.getAllConfigParams(function (params) {
            socket.emit('setAllConfigParams', params);
        });
    });

    //**********************************************************
    //**********************************************************
    //
    //   M A I L S E N D E R
    //
    //**********************************************************
    //**********************************************************

    socket.on('senMessageByEmail', function (mes) {
        console.log("senMessageByEmail");
        console.log(mes);
        //mailsender.notify(mes.message);


        backuper.createBackup({
            filepath : "./dbdata/checks.db"
            , filename : "checks.db"
            , resultname : "dbdata/test.zip"
        })


        mes.text = mes.message;
        mes.path = "dbdata/test.zip";
        mes.name = "test.zip";
        mailsender.sendbackup(mes);
    });

});

///////////////////////////////////////
//***********************************************************
//***********************************************************


var fs = require('fs');

setInterval(function () {

    try {
        ;
    } catch (error) {
        ;
    }

}, 1000);

module.exports = app;


///////////////////////////////
///////////////////////////////

/*
 saleserver.addIngridientMass({type : 'g', name : 'г'});
 saleserver.addIngridientMass({type : 'ml', name : 'мл'});
 saleserver.addIngridientMass({type : 'pice', name : 'штк'});
 */

