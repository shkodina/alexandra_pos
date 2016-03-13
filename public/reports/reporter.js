angular.module('reporter', [
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


        function resetReports() {
            main.checkreportlist = null;
            main.checkdetaled = null;
            main.kassareportlist = null;
        }


        //------------------------------------------------------------------
        //------------------------------------------------------------------
        //
        //     C H E C K S
        //
        //------------------------------------------------------------------
        //------------------------------------------------------------------

        main.reportChecks = function () {
            resetReports();
            valueService.getSocket().emit('getReportAllChecks', {});
        };

        main.checkReportDetale = function(check){
            main.checkdetaled = check;
        };

        valueService.getSocket().on('setReportAllChecks', function (mes) {
            console.log('on(setReportAllChecks, function (mes)');
            console.log(mes);

           main.checkreportlist = mes;
            $scope.$apply();
        });



        //------------------------------------------------------------------
        //------------------------------------------------------------------
        //
        //     K A S S A
        //
        //------------------------------------------------------------------
        //------------------------------------------------------------------

        main.reportKassa = function () {
            resetReports();
            valueService.getSocket().emit('getCurrentMoneyFromKassa', 0);
            valueService.getSocket().emit('getReportAllKassaOper', {});
        };

        main.getKassaOperType = function(type){
            switch (type){
                case "add_by_check":
                    return "добавлено по чеку";
                case "get_manual":
                    return "изъято вручную";
                case "add_manual":
                    return "добавлено вручную";
                default :
                    return "неизвестная операция";
            }
        };

        main.kassaReportDetale = function(oper){
            if ("reason" in oper.money){ // manual
                main.checkdetaled = null;
                alert(oper.money.reason);
            }else{ // check
                valueService.getSocket().emit('getCheckByDate', oper.money.date);
            }
        }

        valueService.getSocket().on('setCheckByDate', function (mes) {
            console.log('setCheckByDate');
            console.log(mes);

            main.checkReportDetale(mes[0]);
            $scope.$apply();
        });


        valueService.getSocket().on('setReportAllKassaOper', function (mes) {
            console.log('on(setReportAllKassaOper, function (mes)');
            console.log(mes);

           main.kassareportlist = mes;
            $scope.$apply();
        });

        valueService.getSocket().on('updateManeyValueFromDB', function (mes) {
            main.curmoney = mes.value;
            $scope.$apply();
        });




    })
    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //
    //      D I R I C T I V E S
    //
    //------------------------------------------------------------------
    //------------------------------------------------------------------

    .directive('reporttable', function () {
        return {
            templateUrl: 'reporttable.tmpl.html'
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
    .directive('checkreportlist', function () {
        return {
            templateUrl: 'checkreportlist.tmpl.html'
        }
    })
    .directive('rightsidecheckdetaled', function () {
        return {
            templateUrl: 'rightsidecheckdetaled.tmpl.html'
        }
    })
    .directive('kassareportlist', function () {
        return {
            templateUrl: 'kassareportlist.tmpl.html'
        }
    })

;
