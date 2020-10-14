app.controller('ReservationsOfVController' , function($scope , $location , $http , $rootScope){
  

    $scope.goToChiffreDaffaire = function(idvol){
        console.log("mbola ato am ReservationOfVController");
        console.log(idvol);
        $location.path('ChiffreAffaire/idvol/' + idvol); //mredirect
    }




    // Check checkboxes checked or not
    $scope.checkVal = function(){
 
        var checkedReservs = [];
        $scope.reservations.forEach(function(reserv) {
    
          if (reserv.selected) {
            
            checkedReservs.push(reserv.idreservation);
          }
        });
        $scope.result = checkedReservs;
        console.log($scope.result);

        //a chaque idreservation dans result, modifier son etat à 10
        checkedReservs.forEach(function(idreservation){
            $http({
                method: 'POST' , 
                url:'http://localhost/WebServicePHPReady/Reservation/valider/idreservation/'+idreservation
            })
            .then(function success(response){
                $scope.message = "Ces passagers cochés ont embarqués ";
            } , function error(response){
                alert('erreur validation anle olona tena nitaingina anle vol!');
            })
        });

     
    }






    var url = $location.url();
        //split it with '/' to get the third party which is the idVol
        var urlArray = url.split('/');
        $scope.idvol = urlArray[3];


    console.log("efa ato ReservationsOfVCtrl");
        var url = $location.url();
        console.log(url);
        $scope.listereservs = (function(){ //fonction tonga de mandeha reefa ao am page ficheUser
            $http({
                method: 'GET' , 
                url: 'http://localhost/WebServicePHPReady/Reservation'+url
            })
            .then(function success(response){
                console.log('liste reçue');
                $scope.reservations = response.data;
                // console.log(response.data.nom);
        
            },function error(response){
                console.log('erreur recup fiche');
                $scope.message = response.data.message;
                console.log($scope.message);

            })
        })();


        $scope.onPageChange = function(){
            //Manao anle appel http get /userss/page/" +currentPage?
            $http({
                method: 'GET',
                url: 'http://localhost/WebServicePHPReady/Vol/vol/page/'+$scope.currentPage
                    
            })
            .then(function success(response){
                var resp = response;
    
                if (resp != null) {
                    console.log(resp.data);
                    $scope.vols = resp.data.data;
                    $scope.pageCount = resp.data.nbPage;
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

});
