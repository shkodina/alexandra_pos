angular.module('exercises', [
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

        main.onClickItem = function (item) {
        };

        valueService.getSocket().on('printMeas', function (mes) {

            for (var index in mes) {
                mes[index];
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