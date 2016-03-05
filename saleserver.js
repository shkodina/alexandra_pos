/**
 * Created by Alex on 05.03.2016.
 */

var drink_manager = require("./mymodules/drink_manager");
drink_manager.init();


var saleserver = {
    addCoffee : function(coffee){
        drink_manager.coffee.insert(coffee, function (err, newDoc) {});
    }
    ,updateCoffee : function(name , coffee){
        drink_manager.coffee.insert({name : name}, coffee, {}, function (err, numReplaced) {});
    }

}

module.exports = saleserver;