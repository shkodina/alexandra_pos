angular.module('admindrinks', [
        'ui.router',
        'ngAnimate',
        'ngMessages'
    ])
    .factory('valueService', function ($rootScope, $location) {

        var socket = io.connect();

        var currentlist = {};

        socket.emit('updateMeFromDB', 0);

        socket.on('setListFromDB', function (mes) {
            console.log("setCoffeeListFromDB mes = ", mes);

            mes.forEach(function (item) {
                console.log ("coffee from list = ", item);
            })

            currentlist = mes;
        });

        return {
            getSocket: function () {
                return socket;
            }
            , getDrink: function () {
                return {
                    type: "тип напитка"
                    , name: "название напитка"
                    , price: "100"
                    , ingredients: null
                }
            }
            , getIngridient: function () {
                return {
                    name: "название ингридиента"
                    , mass: "g"
                    , count: "10"
                }
            }
        }
    })
    .controller('MainCtrl', function ($scope, $rootScope, valueService) {
        var main = this;
        main.title = 'Bubble Maker';

        main.curdrink = valueService.getDrink();
        main.curlist = {};
        main.ingridient = valueService.getIngridient();

        valueService.getSocket().on('setListFromDB', function (mes) {
            main.curlist = mes;
            $scope.$apply();
        });

        main.chooseDrinkType = function (drinktype) {
            main.curdrink = valueService.getDrink();
            main.curdrink.type = drinktype;
            valueService.getSocket().emit('updateMeFromDB', {type: drinktype});
        };

        main.addCurDrinkToDB = function () {
            valueService.getSocket().emit('addCurDrinkToDB', main.curdrink);
            valueService.getSocket().emit('updateMeFromDB', {type: main.curdrink.type});
            main.curdrink = valueService.getDrink();
        };

        main.deleteCurDrinkFromDB = function(){
            valueService.getSocket().emit('deleteCurDrinkFromDB', main.curdrink);
            valueService.getSocket().emit('updateMeFromDB', {type: main.curdrink.type});
            main.curdrink = valueService.getDrink();
        };

        main.setCurentItem = function (item) {
            main.curdrink = item;
        };

        main.useIngridients = function () {
            main.curdrink.ingredients = [];
        };

        main.addIngridientToDrink = function () {
            main.curdrink.ingredients.push(main.ingridient);
            main.ingridient = valueService.getIngridient();
        };


        main.getItemReadableName = function(){
            switch (main.curdrink.type){
                case  "coffee" :
                    return " кофейный напиток";
                case  "tea" :
                    return " чайный напиток";
                case  "juice" :
                    return " сок или фруктовый напиток";
                case  "bubble" :
                    return " коктейль Bubble Tea !!!";
                case  "sport" :
                    return " спортпит напиток";
                default:
                    return " неизвестный напиток ???";
            }
        }

        valueService.getSocket().on('printMeas', function (mes) {
            $scope.$apply();
        });
    })
    .directive('adddrink', function () {
        return {
            templateUrl: 'adddrink.tmpl.html'
        }
    })
    .directive('addingridient', function () {
        return {
            templateUrl: 'addingridient.tmpl.html'
        }
    })
    .directive('inform', function () {
        return {
            templateUrl: 'inform.tmpl.html'
        }
    })
;
