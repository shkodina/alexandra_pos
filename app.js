var myapp = {
    run: function () {


        var express = require('express');
        var path = require('path');
//var favicon = require('serve-favicon');
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
                //console.log("getAllGroupsFromDB");
                console.log(msg);
                saleserver.getAllGroups(function (docs) {
                    socket.emit('setGroupsFromDB', docs);
                });
            });

            socket.on('deleteCurGroupFromDB', function (msg) {
                console.log("deleteCurGroupFromDB");
                console.log(msg);
                saleserver.deleteCurGroupFromDB(msg);
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
                mes.notifed = false;
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
                mes.notifed = false;
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
            //   M A I L S E N D E R   A N D    B A C K U P E R
            //
            //**********************************************************
            //**********************************************************

            socket.on('senMessageByEmail', function (mes) {
                console.log("senMessageByEmail");
                console.log(mes);
                mailsender.notify(mes.message);
            });


            socket.on('senFullBackupByEmail', function (mes) {
                console.log("senFullBackupByEmail");
                console.log(mes);

                var cnf = tooler.prepareFullBackupConfig();
                backuper.createBackup(cnf);

                console.log("senFullBackupByEmail send backup by email");

                mes.text = "Полный бэкап базы";
                mes.path = cnf.resultname;
                mes.name = cnf.backupname;
                mailsender.sendbackup(mes);
            });


            socket.on('askFullListOfBackupsFromServer', function (mes) {
                console.log("askFullListOfBackupsFromServer");
                console.log(mes);

                var fs = require('fs');
                var files = fs.readdirSync('./backups');
                console.log(files);

                socket.emit('setFullListOfBackupsFromServer', {list: files});
            });


            socket.on('deleteBackupFromServer', function (mes) {
                console.log("deleteBackupFromServer");
                console.log(mes);

                var fs = require('fs');
                fs.unlinkSync('./backups/' + mes.name);

            });

            socket.on('getOperBackup', function (mes) {
                console.log("getOperBackup");
                console.log(mes);


                var cnf = tooler.prepareOperDBBackupConfig();
                backuper.createBackup(cnf);

                console.log("getOperBackup send backup by email");

                mes.text = "Оперативный бэкап базы";
                mes.path = cnf.resultname;
                mes.name = cnf.backupname;
                mailsender.sendbackup(mes);


                if (mes.needdeletedbfiles) {
                    console.log("getOperBackup ask delete files");
                    console.log("getOperBackup delete files");

                    var dbconf = require("./mymodules/dbconf.json");
                    var fs = require('fs');
                    console.log(dbconf);
                    for (var i in dbconf.dblist) {
                        if ("kassaoper" in dbconf.dblist[i]) {
                            console.log("found kassaoper = ", dbconf.dblist[i].kassaoper);
                            var fullpath = dbconf.rootdir + dbconf.dblist[i].kassaoper;
                            console.log("fullpath = ", fullpath);
                            fs.unlinkSync(fullpath);
                        }
                        if ("checks" in dbconf.dblist[i]) {
                            console.log("found checks = ", dbconf.dblist[i].checks);
                            var fullpath = dbconf.rootdir + dbconf.dblist[i].checks;
                            console.log("fullpath = ", fullpath);
                            fs.unlinkSync(fullpath);
                        }
                    }

                    console.log("getOperBackup restart server");
                    process.exit(66);
                }
            });

            socket.on('sendOldBackupToEmail', function (mes) {
                console.log("sendOldBackupToEmail");
                console.log(mes);

                mes.text = "Повторный заказанный бэкап";
                mes.path = "./backups/" + mes.name;
                mes.name = mes.name;
                mailsender.sendbackup(mes);
            });


            //**********************************************************
            //**********************************************************
            //
            //   A D M I N   R E S T A R T    C O M M A N D S
            //
            //**********************************************************
            //**********************************************************

            socket.on('sendCommandToServerForRestart', function (mes) {
                console.log("sendCommandToServerForRestart");
                console.log(mes);

                process.exit(1);
            });

            //**********************************************************
            //**********************************************************
            //
            //   R E P O R T E R
            //
            //**********************************************************
            //**********************************************************

            socket.on('getReportAllChecks', function (mes) {
                console.log("getReportAllChecks");
                console.log(mes);
                saleserver.getReportAllChecks(function (checks) {
                    socket.emit('setReportAllChecks', checks);
                });

            });

            socket.on('getReportAllKassaOper', function (mes) {
                console.log("getReportAllKassaOper");
                console.log(mes);
                saleserver.getReportAllKassaOper(function (checks) {
                    socket.emit('setReportAllKassaOper', checks);
                });

            });

            socket.on('getCheckByDate', function (date) {
                console.log("getCheckByDate");
                console.log(date);
                saleserver.getCheckByDate(date, function (checks) {
                    socket.emit('setCheckByDate', checks);
                });

            });



        });

//**********************************************************
//**********************************************************
//
//   H E L P E R    A N D    U T I L S
//
//**********************************************************
//**********************************************************

        var tooler = {
            prepareFullBackupConfig: function () {

                var now = new Date();

                var backuppath = "backups/";
                var backupname = "backup-" +
                    now.getFullYear() + "-" +
                    (now.getMonth() + 1) + "-" +
                    now.getUTCDate() + "-" +
                    now.getHours() + "-" +
                    now.getMinutes() + ".zip";

                var dbconf = require("./mymodules/dbconf.json");

                var configforbackuper = {
                    files: []
                    , resultname: backuppath + backupname
                    , backupname: backupname
                };

                for (var i in dbconf.dblist) {
                    for (var f in dbconf.dblist[i]) {
                        configforbackuper.files.push({
                            name: dbconf.dblist[i][f]
                            , path: dbconf.rootdir + dbconf.dblist[i][f]
                        })
                    }
                    ;
                }
                ;
                return configforbackuper;
            }
            , prepareOperDBBackupConfig: function () {

                var now = new Date();

                var backuppath = "backups/";
                var backupname = "backup-oper-" +
                    now.getFullYear() + "-" +
                    (now.getMonth() + 1) + "-" +
                    now.getUTCDate() + "-" +
                    now.getHours() + "-" +
                    now.getMinutes() + ".zip";

                var configforbackuper = {
                    files: []
                    , resultname: backuppath + backupname
                    , backupname: backupname
                };

                var dbconf = require("./mymodules/dbconf.json");

                var pushToFiles = function (item, name) {
                    var file = {
                        name: item[name]
                        , path: dbconf.rootdir + item[name]
                    };
                    configforbackuper.files.push(file);
                };

                for (var i in dbconf.dblist) {
                    if ("kassaoper" in dbconf.dblist[i]) {
                        pushToFiles(dbconf.dblist[i], "kassaoper");
                    }
                    if ("kassa" in dbconf.dblist[i]) {
                        pushToFiles(dbconf.dblist[i], "kassa");
                    }
                    if ("checks" in dbconf.dblist[i]) {
                        pushToFiles(dbconf.dblist[i], "checks");
                    }
                }


                return configforbackuper;
            }
        }

//**********************************************************
//**********************************************************
//
//   N O T I F I C A T O R
//
//**********************************************************
//**********************************************************

        var notificator = {

            checkIngridients: function (mailsender, saleserver) {

                //console.log('checkIngridients');

                saleserver.getAllIngridients(function (ingrlist) {
                    var ingridientslowcount = new Array;
                    for (var i in ingrlist) {
                        if ((+(ingrlist[i].count)) <= (+(ingrlist[i].limit))) {
                            //console.log('checkIngridients find to notify = ', ingrlist[i]);
                            if (ingrlist[i].notifed != true) {
                                ingrlist[i].notifed = true;
                                ingridientslowcount.push(ingrlist[i]);
                            }
                        }
                    }

                    //console.log('ingridientslowcount.length  = ', ingridientslowcount.length );
                    if (ingridientslowcount.length  == 0){
                        return;
                    }

                    var message = "<p>Следующий набор ингридиентов требует пополнения:</p>";
                    for (var i2 in ingridientslowcount) {
                        message = message
                                + "<p>"
                            + ingridientslowcount[i2].name
                            + ": <strong>остаток : "
                            + ingridientslowcount[i2].count
                            + " "
                            + ingridientslowcount[i2].mass
                            + "</strong></p>"
                    }
                    //console.log('checkIngridients message = ', message);

                    mailsender.notify(message);
                    //console.log('checkIngridients message send ');

                    ingridientslowcount.forEach(function (ing) {
                        //console.log('checkIngridients try update ingridient ', ing.name);
                        saleserver.updateIngridient(ing);
                    });
                    //console.log('checkIngridients updateIngridient fifnished ');

                })
            }
        }

//**********************************************************
//**********************************************************
//
//   T I M E R S
//
//**********************************************************
//**********************************************************


        var fs = require('fs');

        setInterval(function () {


            try {
                notificator.checkIngridients(mailsender, saleserver);
            } catch (error) {
                console.log("catch error: ", error);
            }

        }, 20 * 60 * 1000); // per 20 minutes
        //},  60 * 1000); // per 1 minutes

        module.exports = app;


    }
}

module.exports = myapp;
///////////////////////////////
///////////////////////////////

/*
 saleserver.addIngridientMass({type : 'g', name : 'г'});
 saleserver.addIngridientMass({type : 'ml', name : 'мл'});
 saleserver.addIngridientMass({type : 'pice', name : 'штк'});
 */

