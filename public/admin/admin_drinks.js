angular.module('admindrinks', [
        'ui.router',
        'ngAnimate',
        'ngMessages'
    ])
    .factory('valueService', function ($rootScope, $location) {

        var socket = io.connect();

        socket.emit('getAllGroupsFromDB', 0);
        socket.emit('getAllIngridientsFromDB', 0);
        socket.emit('getAllIngridientsMassFromDB', 0);

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
                    name: null
                    , mass: 'g'
                    , type : {}
                    , count: "1000"
                    , limit : 1
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







        //------------------------------------------------------------------
        //------------------------------------------------------------------
        //
        //     D R I N K S
        //
        //------------------------------------------------------------------
        //------------------------------------------------------------------

        main.curdrink = valueService.getDrink();
        main.curlist = {};

        valueService.getSocket().on('setAdminListFromDB', function (mes) {
            //console.log("get drinks list from db");
            mes.forEach(function(item){
                console.log('group = ', item);
            })
            main.curlist = mes;
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

        //------------------------------------------------------------------
        //------------------------------------------------------------------
        //
        //     I N G R I D I E N T    F O R   D R I N K S
        //
        //------------------------------------------------------------------
        //------------------------------------------------------------------

        main.ingridient = valueService.getIngridient();
        main.ingridientsfromdb = {};
        main.ingridientsmassfromdb = {};

        valueService.getSocket().on('setAllIngridientsFromDB', function(mes){
            //console.log("get ingridients from DB");
            //console.log(mes);

            main.ingridientsfromdb = mes;
            $scope.$apply();
        });

        valueService.getSocket().on('setAllIngridientsMassFromDB', function(mes){
            //console.log("get ingridients mass from DB");
            //console.log(mes);

            main.ingridientsmassfromdb = mes;
        });

        main.useIngridients = function () {
            main.curdrink.ingredients = [];
            main.showAllIngridients();
        };

        main.addIngridientToDrink = function () {
            main.curdrink.ingredients.push(main.ingridient);
            main.ingridient = valueService.getIngridient();
        };

        main.setIngridientForDrink = function(ingrfromdb){
            main.ingridient = ingrfromdb;
        };

        //------------------------------------------------------------------
        //------------------------------------------------------------------
        //
        //      N E W   G R O U P     F O R   D B
        //
        //      G R O U P S
        //
        //------------------------------------------------------------------
        //------------------------------------------------------------------

        main.groups = {};
        main.curgroup = null;
        main.newgroup = null;


        valueService.getSocket().on('setGroupsFromDB', function(mes){
            //console.log("get groups from db");
            //console.log(mes);
            main.groups = mes;

            mes.forEach(function(item){
                console.log('group = ', item);
            })
            $scope.$apply();
        });

        main.needNewGroup = function(){
            main.newgroup = valueService.getNewGroup();
        };

        main.addGroupToDB = function(){
            valueService.getSocket().emit('addNewGroupToDB', main.newgroup);
            main.ingridientnewfordb = null;
            valueService.getSocket().emit('getAllGroupsFromDB', 0);
        };

        main.cancelNewGroup = function(){
            main.newgroup = null;
        };


        //------------------------------------------------------------------
        //------------------------------------------------------------------
        //
        //      N E W   I N G R I D I E N T    F O R   D B
        //
        //------------------------------------------------------------------
        //------------------------------------------------------------------

        main.ingridientnewfordb = null;
        main.showallingridients = null;

        main.needNewIngngridientForDB = function(){
            main.ingridientnewfordb = valueService.getIngridient();
        }

        main.addNewIngngridientToDB = function(){

            if("_id" in main.ingridientnewfordb) {
                //alert("try update ingridient : " + main.ingridientnewfordb.name);
                valueService.getSocket().emit('updateIngridientInDB', main.ingridientnewfordb);
                main.ingridientnewfordb = null;
                valueService.getSocket().emit('getAllIngridientsFromDB', 0);
                return ;
            }

            for (var i in main.ingridientsmassfromdb) {
                console.log
                if (main.ingridientsmassfromdb[i].name == main.ingridientnewfordb.mass){
                    main.ingridientnewfordb.type = main.ingridientsmassfromdb[i].type;
                }
            }
            valueService.getSocket().emit('addIngridientToDB', main.ingridientnewfordb);
            main.ingridientnewfordb = null;
            valueService.getSocket().emit('getAllIngridientsFromDB', 0);
        };

        main.cancelNewIngngridient = function(){
            main.ingridientnewfordb = null;
        };

        main.setIngridientForEdit = function(ingr){
            main.ingridientnewfordb = ingr;
        };

        main.setIngridientForDelete = function(ingr){
            //alert("try delete ingridient " + ingr.name);
            valueService.getSocket().emit('deleteIngridientFromDB', ingr);
            main.ingridientnewfordb = null;
            valueService.getSocket().emit('getAllIngridientsFromDB', 0);
        };



        main.showAllIngridients = function(){
            main.showallingridients = {};
        };
         main.hideAllIngridients = function(){
            main.showallingridients = null;
        };

        //------------------------------------------------------------------
        //------------------------------------------------------------------
        //
        //      A D D    A N D    G E T    M O N E Y
        //
        //------------------------------------------------------------------
        //------------------------------------------------------------------

        main.moneyinuse = null;

        main.money = {
            date : {}
            , timestamp : {}
            , count : 0
            , reason : "Просто захотелось"
        };
        main.curmoney = 0;
        valueService.getSocket().on('updateManeyValueFromDB', function(mes){
            main.curmoney = mes.value;
            $scope.$apply();
        });

        main.useMoney = function(){
            main.moneyinuse = {};
            valueService.getSocket().emit('getCurrentMoneyFromKassa', 0);
        }

        main.noUseMoney = function(){
            main.moneyinuse = null;
        }

        main.getMoneyFromKassa = function(){
            main.money.date = new Date();
            main.money.timestamp = main.money.date.getTime();
            valueService.getSocket().emit('getMoneyFromKassa',main.money);
            main.moneyinuse = null;

        };

        main.addMoneyToKassa = function(){
            main.money.date = new Date();
            main.money.timestamp = main.money.date.getTime();
            valueService.getSocket().emit('addMoneyToKassa',main.money);
            main.moneyinuse = null;
        };

    })

    //------------------------------------------------------------------
    //------------------------------------------------------------------
    //
    //      D I R I C T I V E S
    //
    //------------------------------------------------------------------
    //------------------------------------------------------------------

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
    .directive('addnewingridienttodb', function () {
        return {
            templateUrl: 'addnewingridienttodb.tmpl.html'
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
    .directive('allingridientstable', function () {
        return {
            templateUrl: 'allingridientstable.tmpl.html'
        }
    })
    .directive('moneyworking', function () {
        return {
            templateUrl: 'moneyworking.tmpl.html'
        }
    })

;
