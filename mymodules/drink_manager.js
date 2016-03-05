/**
 * Created by Alex on 05.03.2016.
 */

var Drink = require("./drink.js");
var Ingredient = require("./ingredient.js");
var Datastore = require('nedb');
var dbconf = require("./conf.json");

var drink_manager = {
    coffee: {}
    , tea: {}
    , bubble: {}
    , sport: {}
    , juice: {}
    , drinks : []
    , init : function (){
        this.coffee = new Datastore(dbconf.rootdir + dbconf.coffeedb);
        this.drinks.push(this.coffee);
        this.tea = new Datastore(dbconf.rootdir + dbconf.teadb);
        this.drinks.push(this.tea);
        this.bubble = new Datastore(dbconf.rootdir + dbconf.bubbledb);
        this.drinks.push(this.bubble);
        this.sport = new Datastore(dbconf.rootdir + dbconf.sportdb);
        this.drinks.push(this.sport);
        this.juice = new Datastore(dbconf.rootdir + dbconf.juicedb);
        this.drinks.push(this.juice);

        this.drinks.forEach(function(db){
            db.loadDatabase();
        })

    }
}

module.exports = drink_manager;
