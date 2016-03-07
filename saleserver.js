/**
 * Created by Alex on 05.03.2016.
 */

var db_manager = require("./mymodules/dbmanager.js");
db_manager.init();



var saleserver = {
    addDrink : function(drink){
        console.log("inserting drink");
        db_manager.drinks.insert(drink, function (err, newDoc) {});
    }
    ,getAllDrinksByType : function (drink_type, sender){
        console.log("asking all " + drink_type);
        db_manager.drinks.find({type : drink_type}).sort({name : 1}).exec(function (err, docs) {
            sender(docs);
        });
    }

}


module.exports = saleserver;