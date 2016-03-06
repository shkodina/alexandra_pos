angular.module('admindrinks', [
        'ui.router',
        'ngAnimate',
        'ngMessages'
    ])
    .factory('valueService', function ($rootScope, $location) {

        var socket = io.connect();

        var coffeelist = {};
        var tealist = {};
        var bubblelist = {};
        var juicelist = {};
        var sportlist = {};

        socket.emit('updateMeFromDB',0);

        socket.on('setCoffeeListFromDB', function(mes){
            console.log("setCoffeeListFromDB mes = ", mes);

            mes.forEach(function(item){
                console.log ("coffee from list = ", item);
            })

            coffeelist = mes;
        });
        socket.on('setTeaListFromDB', function(mes){
            tealist = mes;
        });
        socket.on('setBubbleListFromDB', function(mes){
            bubblelist = mes;
        });
        socket.on('setJuiceListFromDB', function(mes){
            juicelist = mes;
        });
        socket.on('setSportListFromDB', function(mes){
            sportlist = mes;
        });


        return {
            getSocket: function () {
                return socket;
            }
            , getDrink: function(){
                return {
                    type : "notype"
                    , name : "noname"
                    , price : 100
                    , ingredients : []
                }
            }
            , getIngridient: function (){
                return {
                    name : name
                    , mass : mass
                    , count :count
                }
            }
            , getDrinkList : function(drinktype){
                switch (drinktype){
                    case "coffee":
                        return coffeelist;
                    case "tea":
                        return tealist;
                    case "bubble":
                        return bubblelist;
                    case "juice" :
                        return juicelist;
                    case "sport" :
                        return sportlist;
                    default :
                        return {};
                }
            }
        }
    })
    .controller('MainCtrl', function ($scope, $rootScope, valueService) {
        var main = this;
        main.title = 'Bubble Maker';

        main.curdrink = valueService.getDrink();
        main.curlist = valueService.getDrinkList(main.curdrink.type);

        main.chooseDrinkType = function (drinktype) {
            main.curdrink.type = drinktype;
            main.curlist = valueService.getDrinkList(main.curdrink.type);
        };

        main.addCurDrinkToDB = function () {
            valueService.getSocket().emit('addCurDrinkToDB',main.curdrink);
        };

        main.setCurentItem = function(item){
            main.curdrink = item;
        }



        valueService.getSocket().on('printMeas', function (mes) {
            $scope.$apply();
        });
    })
    .directive('item', function () {
        return {
            templateUrl: 'item.tmpl.html'
        }
    })
;
