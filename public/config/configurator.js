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
            , getNewParam: function () {
                return {
                    name: ""
                    , key: ""
                    , value: null
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

        valueService.getSocket().on('setAllConfigParams', function (mes) {
            main.paramlist = mes;
            $scope.$apply();
        });

        main.createNewParam = function () {
            main.newparam = valueService.getNewParam();
        };

        main.addNewParamToDB = function () {
            valueService.getSocket().emit('addNewConfigParamToDB', main.newparam);
            main.cancelNewParamToDB();
            valueService.getSocket().emit('getAllConfigParams', 0);
        };

        main.updateConfigParamToDB = function (param) {
            param.value = prompt("Новое значение для параметра " + param.name, param.value);
            valueService.getSocket().emit('updateConfigParamToDB', param);
            valueService.getSocket().emit('getAllConfigParams', 0);
        };


        main.cancelNewParamToDB = function () {
            main.newparam = null;
        };

        main.senMessageByEmail = function () {
            var message = prompt("Введите текст для тестового письма");
            valueService.getSocket().emit('senMessageByEmail', {message: message});
        };

        main.senFullBackupByEmail = function () {
            valueService.getSocket().emit('senFullBackupByEmail', {});
        };


        main.sendCommandToServerForRestart = function () {
            valueService.getSocket().emit('sendCommandToServerForRestart', {});
            alert("Сервер будет перезагружен! Перезазгрузите страницу...");
        }

        main.askFullListOfBackupsFromServer = function () {
            valueService.getSocket().emit('askFullListOfBackupsFromServer', {});
        }

        main.backuplist = null;
        valueService.getSocket().on('setFullListOfBackupsFromServer', function (mes) {
            main.backuplist = mes.list;
            $scope.$apply();
        });

        main.deleteBackup = function(item){
            if(confirm("Вы точно хотите удалить файл: " + item)){
                valueService.getSocket().emit('deleteBackupFromServer', {name : item});
                valueService.getSocket().emit('askFullListOfBackupsFromServer', {});
            }
        }

        main.getOperBackup = function(){
            var needdeletedbfiles = confirm("Удалить старые файлы после бекапа?")
            valueService.getSocket().emit('getOperBackup', {
                needdeletedbfiles : needdeletedbfiles
            });
            valueService.getSocket().emit('askFullListOfBackupsFromServer', {});
        }

        main.sendOldBackupToEmail = function(item){
            if(confirm("Вы точно хотите запросить файл: " + item)){
                valueService.getSocket().emit('sendOldBackupToEmail', {
                    name : item
                });
                alert("Бэкап будет выслан на почту");
            }

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
    .directive('backupactions', function () {
        return {
            templateUrl: 'backupactions.tmpl.html'
        }
    })

;
