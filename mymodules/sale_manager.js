/**
 * Created by Alex on 05.03.2016.
 */

var Datastore = require('nedb');
var dbconf = require("./conf.json");

var sales_manager = {
    checks : {}
    , init : function () {
        this.checks = new Datastore(dbconf.rootdir + dbconf.checksdb);
        this.checks.loadDatabase();
    }
}

module.exports = sales_manager;
