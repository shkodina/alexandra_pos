/**
 * Created by Alex on 05.03.2016.
 */

var db_manager = require("./mymodules/dbmanager.js");
db_manager.init();



var saleserver = {
    addDrink : function(drink){
        if (drink.ingredients != null){
            drink.ingredients.forEach(function(ing){
                delete ing['$$hashKey'];
            });
        }

        db_manager.drinks.insert(drink, function (err, newDoc) {
            if (err != null) {
                console.log("error = ", err);
            }
        });
    }
    ,getAllDrinksByType : function (drink_type, sender){
        db_manager.drinks.find({type : drink_type}).sort({name : 1}).exec(function (err, docs) {
            sender(docs);
        });
    }
    , deleteDrink : function(drink){
        db_manager.drinks.remove({ type: drink.type, name : drink.name }, {}, function (err, numRemoved) {
            if (err != null) {
                console.log("error = ", err);
            }
        });
    }

}


module.exports = saleserver;