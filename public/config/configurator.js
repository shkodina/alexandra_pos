angular.module('configurator', [
        'ui.router',
        'ngAnimate',
        'ngMessages'
    ])
    .factory('valueService', function ($rootScope, $location) {

        var socket = io.connect();

        socket.emit('getAllConfigParams', 0);


        return {
            getSocket: function () {
                return socket;
            }
            , getNewParam : function(){
                return {
                    name : ""
                    , key : ""
                    , value : null
                }
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
        main.newparam = null;
        main.paramlist = [];
        main

        valueService.getSocket().on('setAllConfigParams', function(mes){
            main.paramlist = mes;
            $scope.$apply();
        })

        main.createNewParam = function(){
            main.newparam = valueService.getNewParam();
        }

        main.addNewParamToDB = function(){
            valueService.getSocket().emit('addNewConfigParamToDB', main.newparam);
            main.cancelNewParamToDB();
        }

        main.updateConfigParamToDB = function(param){
            var newvalue = prompt("Новое значение для параметра " + param.name, param.value);
            param.value = newvalue;
            valueService.getSocket().emit('updateConfigParamToDB', param);
            valueService.getSocket().emit('getAllConfigParams', 0);
        }



        main.cancelNewParamToDB = function(){
            main.newparam = null;
        }
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
    .directive('createnewparam', function () {
        return {
            templateUrl: 'createnewparam.tmpl.html'
        }
    })

;
