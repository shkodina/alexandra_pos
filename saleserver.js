/**
 * Created by Alex on 05.03.2016.
 */

var drink_manager = require("./mymodules/drink_manager");
drink_manager.init();



var saleserver = {
    addCoffee : function(coffee){
        console.log("inserting coffee");
        drink_manager.coffee.insert(coffee, function (err, newDoc) {});
    }
    ,updateCoffee : function(name , coffee){
        drink_manager.coffee.insert({name : name}, coffee, {}, function (err, numReplaced) {});
    }
    ,drinklists : []
    ,getAllCoffee : function (){
        console.log("asking all coffee");
        drink_manager.coffee.find({}, function (err, docs) {
            console.log("docs = ", docs);
            setdrinklist(docs, "coffee");
        });
    }

}
function setdrinklist(drinklist, drinktype){

    var curlist = {
        type : drinktype
        , list : drinklist
        , isupdated : true
    };

    var needpush = true;

    saleserver.drinklists.forEach(function(item){
        if (item.type == drinktype){
            item.list = drinklist;
            item.isupdated = true;

            needpush = false;
            console.log("update old value")
        }
    })

    if (needpush){
        saleserver.drinklists.push(curlist);
        console.log("push new value")
    }
}

module.exports = saleserver;