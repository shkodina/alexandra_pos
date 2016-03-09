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
        this.drinks = new Datastore(dbconf.rootdir + dbconf.drinksdb);
        this.drinks.loadDatabase();
        this.checks = new Datastore(dbconf.rootdir + dbconf.checksdb);
        this.checks.loadDatabase();
        this.groups = new Datastore(dbconf.rootdir + dbconf.groupsdb);
        this.groups.loadDatabase();
        this.ingidients = new Datastore(dbconf.rootdir + dbconf.ingidientsdb);
        this.ingidients.loadDatabase();
    }
}

module.exports = db_manager;
