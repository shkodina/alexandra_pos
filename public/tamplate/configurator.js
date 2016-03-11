angular.module('configurator', [
        'ui.router',
        'ngAnimate',
        'ngMessages'
    ])
    .factory('valueService', function ($rootScope, $location) {

        var socket = io.connect();

       // socket.emit('getAllGroupsFromDB', 0);


        return {
            getSocket: function () {
                return socket;
            }
        }
    })

    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //
    //     C O N T R O L L E R       M A I N
    //
    //------------------------------------------------------------------
    //------------------------------------------------------------------

    .controller('MainCtrl', function ($scope, $rootScope, valueService) {
        var main = this;
        main.title = 'Bubble Maker';




    })
    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //
    //      D I R I C T I V E S
    //
    //------------------------------------------------------------------
    //------------------------------------------------------------------

    .directive('configparams', function () {
        return {
            templateUrl: 'configparams.tmpl.html'
        }
    })
    .directive('inform', function () {
        return {
            templateUrl: 'inform.tmpl.html'
        }
    })
    .directive('topbarcontent', function () {
        return {
            templateUrl: 'topbarcontent.tmpl.html'
        }
    })
    .directive('leftmainsidebarmenu', function () {
        return {
            templateUrl: 'leftmainsidebarmenu.tmpl.html'
        }
    })

;
