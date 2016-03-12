/**
 * Created by Alex on 12.03.2016.
 */

var cluster = require('cluster');
if (cluster.isMaster) {
    cluster.fork();

    cluster.on('exit', function(worker, code, signal) {
        console.log("server die once");
        console.log("server die once, worker", worker);
        console.log("server die once, code", code);
        console.log("server die once, signal", signal);

        if (code == 66){
            console.log("DB FILES WERE DELETED!!!");
            console.log("PREPARE FOR SOMETHING TERRABLE!!!");
        }
        cluster.fork();
    });
}

if (cluster.isWorker) {
    // put your code here
    var myapp = require("./app.js");
    myapp.run();
}


