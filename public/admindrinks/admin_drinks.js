angular.module('admindrinks', [
        'ui.router',
        'ngAnimate',
        'ngMessages'
    ])
    .factory('valueService', function ($rootScope, $location) {

        var socket = io.connect();

        return {
            getSocket: function () {
                return socket;
            }
        }
    })
    .controller('MainCtrl', function ($scope, $rootScope, valueService) {
        var main = this;
        main.title = 'Bubble Maker';

        main.curdrink = {
            type : "Просто коктейль"
        };
        main.cur_mea = {};

        main.chooseCoffee = function () {
            main.curdrink.type = "coffee"
            valueService.getSocket().emit("test", main.curdrink);
        };

        main.chooseTea = function () {
            main.curdrink.type = "tea"
            valueService.getSocket().emit("test", main.curdrink);
        };

        main.chooseJuice = function () {
            main.curdrink.type = "juice"
            valueService.getSocket().emit("test", main.curdrink);
        };

        main.chooseBubble = function () {
            main.curdrink.type = "bubble"
            valueService.getSocket().emit("test", main.curdrink);
        };

        main.chooseSport = function () {
            main.curdrink.type = "sport"
            valueService.getSocket().emit("test", main.curdrink);
        };



        valueService.getSocket().on('printMeas', function (mes) {
            //console.log('printMeas', mes);

            //console.log("compass", compass); // this will show the info it in firebug console

            for (var index in mes) {
                //console.log("mes index",compass[mes[index].way]);
                mes[index].compass = valueService.getCompass()[mes[index].way];
                //console.log("mes index compass",mes[index].compass);

                mes[index].quality_text = (mes[index].quality == "0") ? "Измерение недостоверно" : " ";

                if (mes[index].threshold == "1") {
                    mes[index].warning = true;
                }

                if (mes[index].threshold == "2") {
                    mes[index].alert = true;
                }
            }

            $scope.main.meas = mes;
            $scope.$apply();

            console.log("printMeas", "All Ok");
        });
    })
    .directive('item', function () {
        return {
            templateUrl: 'item.tmpl.html'
        }
    })
;
