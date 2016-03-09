angular.module('admindrinks', [
        'ui.router',
        'ngAnimate',
        'ngMessages'
    ])
    .factory('valueService', function ($rootScope, $location) {

        var socket = io.connect();

        var currentlist = {};

        socket.on('setAdminListFromDB', function (mes) {
            currentlist = mes;
        });

        socket.emit('getAllGroupsFromDB', 0);


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
              , getNewGroup: function () {
                return {
                    type: "newgroup"
                    , name: "Новая группа"
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

        main.groups = {};
        main.curgroup = null;
        main.newgroup = null;


        valueService.getSocket().on('setAdminListFromDB', function (mes) {
            console.log("get drinks list from db");
            mes.forEach(function(item){
                console.log('group = ', item);
            })
            main.curlist = mes;
            $scope.$apply();
        });

        valueService.getSocket().on('setGroupsFromDB', function(mes){
            console.log("get groups from db");
            console.log(mes);
            main.groups = mes;

            mes.forEach(function(item){
                console.log('group = ', item);
            })
            $scope.$apply();
        });

        main.chooseDrinkType = function (group) {
            main.curgroup = group;
            main.curdrink = valueService.getDrink();
            main.curdrink.type = main.curgroup.type;
            valueService.getSocket().emit('updateAdminFromDB', {type: main.curgroup.type});
        };

        main.addCurDrinkToDB = function () {
            if (main.curgroup == null){
                alert("Выбери группу, куда добавить");
                return;
            }
            valueService.getSocket().emit('addCurDrinkToDB', main.curdrink);
            valueService.getSocket().emit('updateAdminFromDB', {type: main.curdrink.type});

            main.curdrink = valueService.getDrink();
            main.curdrink.type = main.curgroup.type;
        };

        main.deleteCurDrinkFromDB = function(){
            valueService.getSocket().emit('deleteCurDrinkFromDB', main.curdrink);
            valueService.getSocket().emit('updateAdminFromDB', {type: main.curdrink.type});
            main.curdrink = valueService.getDrink();
            main.curdrink.type = main.curgroup.type;
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




        main.needNewGroup = function(){
            main.newgroup = valueService.getNewGroup();
        };

        main.addGroupToDB = function(){
            valueService.getSocket().emit('addNewGroupToDB', main.newgroup);
            main.newgroup = null;
            valueService.getSocket().emit('getAllGroupsFromDB', 0);
        };

        main.cancelNewGroup = function(){
            main.newgroup = null;
        };






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
    .directive('addgroupe', function () {
        return {
            templateUrl: 'addgroupe.tmpl.html'
        }
    })

;
