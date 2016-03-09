angular.module('maincontroller', [
        'ui.router',
        'ngAnimate',
        'ngMessages'
    ])
    .factory('valueService', function ($rootScope, $location) {

        var socket = io.connect();

        var drinklists = {types : []};


        socket.emit('updateMainFromDB', 0);
        socket.emit('getAllGroupsFromDB', 0);


        socket.on('setMainDrinkListFromDB', function (mes) {
            mes.forEach(function (item) {
                if (!(item.type in drinklists)) {
                    drinklists[item.type] = {
                        type: item.type
                        , list: []
                    }

                    drinklists.types.push(item.type);
                }

                drinklists[item.type].list.push(item);
            })

            $rootScope.$apply();
        });

        return {
            getSocket: function () {
                return socket;
            }
            , getDrinkList: function () {
                return drinklists;
            }
            , getNewCheck: function(){
                return {
                    list: []
                    , total: 0
                    , date: {}
                }
            }
        }
    })
    .controller('MainCtrl', function ($scope, $rootScope, valueService) {
        var main = this;
        main.title = 'Bubble Maker';

        main.drinklists = valueService.getDrinkList();
        main.curdrinktype = {};
        main.check = valueService.getNewCheck();

        valueService.getSocket().on('setListFromDB', function (mes) {
            main.curlist = mes;
            $scope.$apply();
        });

        main.groups = {};
        valueService.getSocket().on('setGroupsFromDB', function(mes){
            main.groups = mes;
            $scope.$apply();
        });

        main.drinkTypeSelected = function(drinktype){
            main.curdrinktype = drinktype;
           // $scope.$apply();
        };

        main.updateScope = function () {
        }

        main.addToCheck = function(drink){
            console.log("drink choosen for sale = ", drink);
            main.check.list.push({id : Math.random(), drink: drink});
            main.check.total += +(drink.price);
        };

        main.removeDrinkFromCheck = function(drink){
            console.log("drink for remove from check = ", drink);

            var newlist = [];

            main.check.list.forEach(function(item){
                if (item.id != drink.id){
                    newlist.push(item);

                }else{
                    main.check.total -= +(drink.drink.price);
                }
            });

            main.check.list = newlist;
        };

        main.applyCheck = function(){
            valueService.getSocket().emit('addCheckToDB', main.check);

            console.log("sending check");
            console.log(main.check);

            <!-- отправить чек в базу -->
            main.check = valueService.getNewCheck();
        };

        main.resetCheck = function(){
            main.check = valueService.getNewCheck();
        };

        main.getItemReadableName = function (drinktype) {
            for (var gr in main.groups){
                console.log('gr = ', main.groups[gr]);
                if (main.groups[gr].type == drinktype){
                    return main.groups[gr].name;
                }
            }
        }

    })
    .directive('ulsidebarmainmenu', function () {
        return {
            templateUrl: 'ulsidebarmainmenu.tmpl.html'
        }
    })
    .directive('rightsidecheck', function () {
        return {
            templateUrl: 'rightsidecheck.tmpl.html'
        }
    })
    .directive('maincontentbody', function () {
        return {
            templateUrl: 'maincontentbody.tmpl.html'
        }
    })
    .directive('informmain', function () {
        return {
            templateUrl: 'informmain.tmpl.html'
        }
    })
;
