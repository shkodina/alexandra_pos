/**
 * Created by Alex on 05.03.2016.
 */

var db_manager = require("./mymodules/dbmanager.js");
db_manager.init();

var saleserver = {
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
    addCheckToDB: function (mes) {
        console.log("ask add check into db");
        console.log(mes);

        mes.list.forEach(function (item) {
            if ('$$hashKey' in item){
                delete item['$$hashKey'];
            }

            if ('$$hashKey' in item.drink){
                delete item.drink['$$hashKey'];
            }
        });

        console.log("after clearing");
        console.log(mes);

        db_manager.checks.insert(mes, function (err, newDoc) {
            if (err != null) {
                console.log("error = ", err);
            }
        });
    },
    getAllGroups: function (sender) {

        db_manager.groups.find({}).sort({
            type: 1
        }).exec(function (err, docs) {
            sender(docs);
        });

    },
    addNewGroup: function (newgroup) {
        console.log("ask add group into db");
        console.log(newgroup);

        db_manager.groups.insert(newgroup, function (err, newDoc) {
            if (err != null) {
                console.log("error = ", err);
            }
        });
    }
    , addIngridient: function (ingr) {
        console.log("ask add ingridient into db");
        console.log(ingr);

        db_manager.ingridients.insert(ingr, function (err, newDoc) {
            if (err != null) {
                console.log("error = ", err);
            }
        });
    }
    , addIngridientMass: function (ingrmass) {
        console.log("ask add ingrmass into db");
        console.log(ingrmass);

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
        if ('$$hashKey' in ingr){
            delete ingr['$$hashKey'];
        }

        db_manager.ingridients.update({_id : ingr._id}, ingr, {}, function (err, newDoc) {
            if (err != null) {
                console.log("error = ", err);
            }
        });
    }
}

module.exports = saleserver;
