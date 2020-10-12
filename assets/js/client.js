var app = angular.module("TestApp", ["ngRoute","ng-pagination"]);

    // manao app run de atao anaty $rootscope le terme rechercé teo am search

    app.config(function ($routeProvider){
        $routeProvider
        .when("/" ,{
            templateUrl : "menu.html",
            controller : "MenuController"
        })
        .when("/trajets" , {
            templateUrl : "listTrajet.html",
            controller : "TrajetController"
        })
        .when("/trajets/id/:id" , {
            templateUrl: "TrajetRUD.html",
            controller : "TrajetIndivController"
        })
        .when("/create" , {
            templateUrl: "createTrajet.html",
            controller : "TrajetController"
        })
        .when("/vols" , {
            templateUrl: "listVol.html",
            controller: "VolController"
        })
        .when("/vols/id/:id" , {
            templateUrl: "VolRUD.html",
            controller: "VolIndivController"
        })
        .when("/createvol" , {
            templateUrl: 'createVol.html',
            controller: 'VolController'
        })
        .when("/tarifs" , {
            templateUrl: 'listTarif.html',
            controller: 'TarifController' 
        })
        .when("/tarifs/id/:id" , {
            templateUrl: "TarifRUD.html" , 
            controller: "TarifIndivController"
        })
        .when("/createtarif" , {
            templateUrl: "createTarif.html" ,
            controller: "TarifController"
        })
    });

    app.factory("AddDaysService" , function () {
        
        return{
           addDays : function addDays(date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
          }
        };
        
    });

    app.run(function($rootScope){
        $rootScope.premiersClics = 1;
        $rootScope.paginationBrute = 1 ;
    });

    app.factory("feedDropdownListTrajet" , function($http , $scope ){

        return {
            feed : function feedDD(){
                
                // var controllerName = $tablename[0].toUpperCase() +  
                // string.slice(1); 

                $http({
                    method: 'GET' , 
                    url: 'http://localhost/WebServicePHPReady/Trajet/trajetAll'
                })
                .then(function success(response){
                    $scope.listDropdown = response.data;

                }, function error(response){
                    alert('erreur feeding dropdownlist !');
                })

                
            }
        };
    });


    app.factory("checkToken" , function($cookies , $location , $http){
                  
        return{
            check : function checkAuth(){
                if(!$cookies.get('token')){
                    console.log('pas encore de token');
                    $location.path('/login');
                }

                //Manao appel http mget ny token an'io olona connecté manana token io 
                    //Ao amin'ilay tokenValue ($cookies.get('token')) tokony hisy identifiant ID an'ilay user afaka décoder-na (avant le premier point ohatra)
                //Alaina anaty response ilay valin'ilay getCookie(ID) tamle http teo
                //Raha tsy mitovy @'ilay token anaty base ilay tokenValue tanaty cookie 
                // else if($cookieStoredNav != $cookieStoredDB){
                    //redirigeo login miaraka am 401 be fa falsifié/bruité izay ilay cookie
                // }
            }
        };

    });

    app.controller("LoginController" , function($scope , $http , $location , $cookies , AddDaysService){
        
        $scope.bienvenu = "Veuillez vous connecter ici";

        // Fonction/Factory login (mcheck user/email , miantso http getcookie , mset cookie:token + date exp)
        
        $scope.login = function(user){

            console.log(user.username);
            console.log('zay vo miditra ato am login');
            var formdata = new FormData();
            formdata.append('username', user.username);
            formdata.append('email', user.email);
            
            $http({
                method: 'POST' , 
                url: 'http://localhost/WebservicePHP/UserController/login' , 
                data: formdata ,
                headers: {
                    'Content-Type': undefined
                }


            }).then(function success(response){
                console.log(response.data);
                //set cookie with the token
                var dateExp = AddDaysService.addDays(new Date() , 3);
                $cookies.put('token' , response.data.token.tokenValue , {
                    expires: dateExp , 
                    samesite: 'strict',
                    secure: false
                  });

                $location.path('/');

            } , function error(response){
                console.log(response.data);
            });



        }


    });

    
    app.controller("UserController", function ($scope , $http , $location , $cookies , AddDaysService , checkToken) {

        //$scope.checkVoalohany = (function checkToken(){ //tokony atao factory
             //mset cookie token pour test kely fotsiny
            //var dateExp = AddDaysService.addDays(new Date() , 3);
            //$cookies.put('token' , 'iubveonfpoqkjioebvkf846523fz' , dateExp);
            //console.log($cookies.get('token'));
            //console.log(dateExp);

        //     if(!$cookies.get('token')){
        //         $location.path('/login');
        //     }
        //})();

        //Config ho an'ireo appels XHR ato am UserController rehetra 
        var config = {
            headers: {
              'Authorization': 'Bearer ' + $cookies.get('token')
            }
          };

        //securisena ihany koa ito page ito 
        checkToken.check($cookies , $location);


        $scope.ficheUser = function(id){
            // var id = $location.search('id');
            console.log("mbola ato am userctrl");
            console.log(id);
            $location.path('/users/id/' + id); //mredirect eto makany am page ficheUser(testFiltre.html) dia aveo iny page iny voadefine ny controller-any amle $routeProvider
        }

        $scope.insert = function(user){

            //securisena ihany koa ito pagena insert ito 
            checkToken.check($cookies , $location);

            var datas = {
                nom : user.nom,
                username : user.username,
                email : user.email
            };
            $http({
                method: 'PUT',
                url : 'http://localhost/WebservicePHP/UserController/users',
                data: datas , 
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }


            }).then(function success(response){
                console.log(response.data);
                $scope.message = response.data.message;
            } , function error(response){
                console.log(response.data);
                $scope.message = response.data.message;
            })
        }

        //fonction rehefa misafidy page anakray etsy amle pager
        $scope.onPageChange = function(){
            //Manao anle appel http get /userss/page/" +currentPage?
            $http({
                method: 'GET',
                url: 'http://localhost/WebservicePHP/UserController/userss/page/'+$scope.currentPage
                    
            })
            .then(function success(response){
                var resp = response;

                if (resp != null) {
                    console.log(resp.data);
                    $scope.users = resp.data.data;
                    //$scope.pageCount = resp.data.nbPage;
                    console.log($scope.pageCount);
                    // $scope.id = response.data.id;
                    // // console.log(response.data.id);
                    // $scope.name = response.data.name;
                    // $scope.email = response.data.email;
                }

            } , function error(response){

            })

            console.log($scope.currentPage);
        };

        $scope.getAllUsers = function(){
            $http({
                method: 'GET',
                url: 'http://localhost/WebservicePHP/UserController/userss/page/1' ,
                // headers: {
                //     'Authorization': 'Bearer ' + $cookies.get('token')
                // }
                    
            })
            .then(function mySuccess(response) {
                var resp = response;

                if (resp != null) {
                    console.log(resp.data);
                    $scope.users = resp.data.data;
                    $scope.pageCount = resp.data.nbPage;
                    console.log($scope.pageCount);


                    // $scope.id = response.data.id;
                    // // console.log(response.data.id);
                    // $scope.name = response.data.name;
                    // $scope.email = response.data.email;
                }

            }, function myError(response) {
                alert('error');
            });

        };


     
        /*$scope.getAllUsers = function(){
            $http({
                method: 'GET',
                url: 'http://localhost/WebservicePHP/UserController/users'
                    
            })
            .then(function mySuccess(response) {
                var resp = response;
                if (resp != null) {
                    console.log(resp.data);
                    $scope.users = resp.data;


                    // $scope.id = response.data.id;
                    // // console.log(response.data.id);
                    // $scope.name = response.data.name;
                    // $scope.email = response.data.email;
                }

            }, function myError(response) {
                alert('error');
            });

        }*/
            
    });

    app.controller('namesCtrl', function($scope , $http , $location , $cookies , checkToken) {


        checkToken.check($cookies , $location);

        
        
        $scope.delete = function(user){
            
            if(confirm('Voulez-vous vraiment supprimer cet utilisateur?')){
                console.log("delete confirmed");
                console.log(user.id);
                let resturl = "/id/"+user.id;

                $http({
                    method: 'DELETE' , 
                    url : 'http://localhost/WebservicePHP/UserController/users'+resturl , 
                    headers: {
                        'Content-type': 'application/json;charset=utf-8'
                    }
                    
                })
                .then(function success(response){
                    
                    console.log(response.data.data);
                    console.log(response.data.message);
                    $scope.message = response.data.message;


                }, function error(response){
                    console.log(response.data.message);
                    $scope.message = response.data.message;
                });

            }else{
                console.log("delete aborted");
            }

        };





        $scope.mod = function(user){
            console.log("l'id'recupéré : ");
            console.log(user.id);

            var formdata = new FormData();
            formdata.append('id', user.id);
            formdata.append('nom', user.nom);
            formdata.append('username', user.username);
            formdata.append('email', user.email);
            
            $http({
                method: 'POST' , 
                url: 'http://localhost/WebservicePHP/UserController/users', 
                data: formdata ,
                headers: {
                    'Content-Type': undefined
                }
                
            })
            .then(function success(response){
                //tokony mverina avany oe User modified! anaty response.data.message
                $scope.message = response.data.message;
                console.log($scope.message);
                console.log(response.data.message);
                
            } , function error(response){
                $scope.message = response.data.message;
                console.log($scope.message);
                console.log(response.data.message);
                
            });
        };





        console.log("efa ato am namesCtrl");
        var url = $location.url();
        console.log(url);
        $scope.fiche = (function(){ //fonction tonga de mandeha reefa ao am page ficheUser
            $http({
                method: 'GET' , 
                url: 'http://localhost/WebservicePHP/UserController'+url
            })
            .then(function success(response){
                console.log('fiche reçue');
                $scope.user = response.data;
                // console.log(response.data.nom);
                console.log($scope.user.nom);
        
            },function error(response){
                console.log('erreur recup fiche');
                $scope.message = response.data.message;
                console.log($scope.message);

            })
        })();






        $scope.eventManoratra = function(){
            if($scope.test !== null && $scope.test !== undefined && $scope.test !== ""){
                $scope.check = true;
            }else{
                $scope.check = false;
            }
            
        }
    
        $scope.check = false;
            
        //console.log($scope.test);
        
            $scope.names = [
              'Jani',
              'Carl',
              'Margareth',
              'Hege',
              'Joe',
              'Gustav',
              'Birgit',
              'Mary',
              'Kai'
          ];
        
        
          
        
    });

    



    