/**
 * Created by Alex on 05.03.2016.
 */

var db_manager = require("./mymodules/dbmanager.js");
db_manager.init();

var saleserver = {
    //**********************************************************
    //**********************************************************
    //
    //    D R I N K S
    //
    //**********************************************************
    //**********************************************************

    addDrink: function (drink) {
        if (drink.ingredients != null) {
            drink.ingredients.forEach(function (ing) {
                delete ing['$$hashKey'];
            });
        }

        db_manager.drinks.insert(drink, function (err, newDoc) {
            if (err != null) {
                console.log("error = ", err);
            }
        });
    },



    getAllDrinksByType: function (drink_type, sender) {
        if (drink_type == null) {
            db_manager.drinks.find({}).sort({
                type: 1,
                name: 1
            }).exec(function (err, docs) {
                sender(docs);
            });
        } else {
            db_manager.drinks.find({
                type: drink_type
            }).sort({
                type: 1,
                name: 1
            }).exec(function (err, docs) {
                sender(docs);
            });
        }

    },



    deleteDrink: function (drink) {
        db_manager.drinks.remove({
            type: drink.type,
            name: drink.name
        }, {}, function (err, numRemoved) {
            if (err != null) {
                console.log("error = ", err);
            }
        });
    },
    //**********************************************************
    //**********************************************************
    //
    //    C H E C K
    //
    //**********************************************************
    //**********************************************************

    addCheckToDB: function (mes) {
        mes.list.forEach(function (item) {
            if ('$$hashKey' in item){
                delete item['$$hashKey'];
            }

            if ('$$hashKey' in item.drink){
                delete item.drink['$$hashKey'];
            }
        });
        db_manager.checks.insert(mes, function (err, newDoc) {
            if (err != null) {
                console.log("error = ", err);
            }
        });
    }



    , updateIngridientsByCheck  : function(check){
        var inglist = [];
        for (var i in check.list){
            if (check.list[i].drink.ingredients != null){
                for (var i2 in check.list[i].drink.ingredients){
                    var ing = {};
                    ing._id =  check.list[i].drink.ingredients[i2]._id;
                    ing.count = check.list[i].drink.ingredients[i2].count;
                    inglist.push(ing);
                }
            }
        }

        inglist.forEach(function(item){
            console.log("ITEM");
            console.log(item);
            db_manager.ingridients.find({_id : item._id},function(err, docs){
                if (err != null){
                    console.error(err);
                    return;
                }
                var newcount = +(docs[0].count) - +(item.count);
                db_manager.ingridients.update({_id : docs[0]._id}, {$set : {count : newcount}}, {}, function (err, numReplaced) {
                    if (err != null) {
                        console.log("error = ", err);
                    }

                });
            });
        });
    }
    //**********************************************************
    //**********************************************************
    //
    //    G R O U P S
    //
    //**********************************************************
    //**********************************************************

    , getAllGroups: function (sender) {
        db_manager.groups.find({}).sort({
            type: 1
        }).exec(function (err, docs) {
            sender(docs);
        });
    },



    addNewGroup: function (newgroup) {
        db_manager.groups.insert(newgroup, function (err, newDoc) {
            if (err != null) {
                console.log("error = ", err);
            }
        });
    }
    //**********************************************************
    //**********************************************************
    //
    //    I N G R I D I E N T S
    //
    //**********************************************************
    //**********************************************************

    , addIngridient: function (ingr) {
        db_manager.ingridients.insert(ingr, function (err, newDoc) {
            if (err != null) {
                console.log("error = ", err);
            }
        });
    }



    , addIngridientMass: function (ingrmass) {
        db_manager.ingridientsmass.insert(ingrmass, function (err, newDoc) {
            if (err != null) {
                console.log("error = ", err);
            }
        });
    }



    , getAllIngridients: function (sender) {
        db_manager.ingridients.find({}).sort({
            type: 1
        }).exec(function (err, docs) {
            sender(docs);
        });
    }



    , getAllIngridientsMass: function (sender) {
        db_manager.ingridientsmass.find({}).sort({
            type: 1
        }).exec(function (err, docs) {
            sender(docs);
        });
    }



    , deleteIngridient: function (ingr) {
        db_manager.ingridients.remove({
            _id : ingr._id
        }, {}, function (err, numRemoved) {
            if (err != null) {
                console.log("error = ", err);
            }
        });
    }



    , updateIngridient: function (ingr) {
        //console.log ('updateIngridient: function (ingr)', ingr);

        if ('$$hashKey' in ingr){
            delete ingr['$$hashKey'];
        }

        db_manager.ingridients.update({_id : ingr._id}, ingr, {}, function (err, newDoc) {
            if (err != null) {
                console.log("error = ", err);
            }
        });
    }
    //**********************************************************
    //**********************************************************
    //
    //    K A S S A
    //
    //**********************************************************
    //**********************************************************

    , addMoneyToKassa : function(money){
        db_manager.kassaoper.insert({type: "add_manual", money : money}, function(err, newDoc){
            if (err != null) {
                console.log("error = ", err);
            }
        })
        db_manager.kassa.update({type : "money"}, {$inc : {value : +(money.count)}},{},function(err, num){
            if (err != null) {
                console.log("error = ", err);
            }
        })
    }



    ,
    getMoneyFromKassa : function(money){
        db_manager.kassaoper.insert({type: "get_manual", money : money}, function(err, newDoc){
            if (err != null) {
                console.log("error = ", err);
            }
        })
        db_manager.kassa.update({type : "money"}, {$inc : {value : -(+(money.count))}},{},function(err, num){
            if (err != null) {
                console.log("error = ", err);
            }
        })
    }



    , getCurrentMoneyValueFromKassa : function(sender){
        db_manager.kassa.find({type : "money"}, function(err, docs){
            if (err != null) {
                console.log("error = ", err);
                return;
            }
            sender(docs[0]);
        })
    }



    , updateKassaByCheck : function(check){
        var money = {
            date : check.date
            , timestamp : check.timestamp
            , count :  check.total
        };

        db_manager.kassaoper.insert({type: "add_by_check", money : money}, function(err, newDoc){
            if (err != null) {
                console.log("error = ", err);
            }
        })
        db_manager.kassa.update({type : "money"}, {$inc : {value : +(check.total)}},{},function(err, num){
            if (err != null) {
                console.log("error = ", err);
            }
        })
    }
    //**********************************************************
    //**********************************************************
    //
    //    C O N F I G U R A T O R
    //
    //**********************************************************
    //**********************************************************

    , addNewConfigParamToDB : function(param){
        db_manager.config.insert(param, function(err, newDoc){
            if (err != null) {
                console.log("error = ", err);
            }
        })
    }

    , updateConfigParamToDB : function(param){
        console.log('updateConfigParamToDB');
        console.log(param);

        db_manager.config.update( { _id : param._id }, {$set : {value : param.value}}, {},function(err, num){
            if (err != null) {
                console.log("error = ", err);
            }
        });
    }

    , getConfigParamByKey : function(key, sender){
        db_manager.config.find({key : key}, function(err, docs){
            if (err != null) {
                console.log("error = ", err);
                return;
            }
            sender(docs[0]);
        })
    }


    , getAllConfigParams : function(sender){
        db_manager.config.find({}).sort({
            key: 1
        }).exec(function (err, docs) {
            sender(docs);
        });
    }
}

module.exports = saleserver;
