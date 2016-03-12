/**
 * Created by Alex on 05.03.2016.
 */

var Drink = require("./drink.js");
var Ingredient = require("./ingredient.js");
var Datastore = require('nedb');
var dbconf = require("./dbconf.json");

var db_manager = {
    drinks: {}
    , init : function (){
        var dbm = this;
        for (var i in dbconf.dblist){
            //console.log('dbconf.dblist [' + i + '] = ',dbconf.dblist[i]);
            for (var f in dbconf.dblist[i]){
               //console.log('f = ',f);
                dbm[f] = new Datastore(dbconf.rootdir + dbconf.dblist[i][f]);
                dbm[f].loadDatabase();
            }
        }
    }
}

module.exports = db_manager;
