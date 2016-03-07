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
    }
}

module.exports = db_manager;
