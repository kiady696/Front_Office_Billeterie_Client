app.controller('ChiffreAffaireController' , function($scope , $location , $http , $rootScope){

    $scope.calculChiffreAbsents = function(){
        //get all reservation d'etat 0 de ce vol $scope.idvol
        $http({
            method: 'GET' ,
            url: 'http://localhost/WebServicePHPReady/Reservation/noneffectives/idvol/'+$scope.idvol
        })
        .then(function success(response){
            $scope.reservesUnsure = response.data;
            console.log($scope.reservesUnsure);
            var totalGainEnPlus = 0;
            $scope.reservesUnsure.forEach(function(element){
                if(Number(element.tarifconditionmodifiable) > 0 || Number(element.tarifconditionremboursable) > 0 ){
                    totalGainEnPlus = totalGainEnPlus + Number(element.montant);
                    console.log(Number(element.tarifconditionmodifiable));
                }
                if(Number(element.tarifconditionmodifiable) == 0){
                    //enlever la date de vol de la reservation de la personne (date billet)
                    $http({
                        method: 'GET' ,
                        url: 'http://localhost/WebServicePHPReady/Billet/removeDate/idpersonne/'+element.idpersonne 
                    })
                    .then(function success(response){
                        console.log('date de vol du passager '+ element.nom +'  enlevée');
                    }, function error(response){
                        alert('erreur enlevement de date de vol du passager absent mais billet modifiable');
                    });
                }
                    
            });
            $scope.gainEnPlus = totalGainEnPlus;
            $scope.totalApres = $scope.total +  $scope.gainEnPlus;
            

        }, function error(response){
            alert('erreur retrieving absents from vol!');
        })

    }



    var url = $location.url();
        //split it with '/' to get the third party which is the idVol
        var urlArray = url.split('/');
        $scope.idvol = urlArray[3];

        $scope.getTarifPlein = (function(){
            $http({
                method:'GET',
                url:'http://localhost/WebServicePHPReady/Tarif/tarifPlein/idvol/'+$scope.idvol
            })
            .then(function success(response){
                $scope.tarifPlein = response.data.montant;
            }, function error(response){
                alert('error getting tarif plein de ce vol!');
            })
        })();

    console.log("efa ato ChiffreAffaireCtrl");
        var url = $location.url();
        console.log(url);

        $scope.listereservsEff = (function(){ //fonction tonga de mandeha reefa ao am page ficheUser
            $http({
                method: 'GET' , 
                url: 'http://localhost/WebServicePHPReady/Reservation/effectives/idvol/'+$scope.idvol
            })
            .then(function success(response){
                console.log('liste reçue');
                $scope.reservationsEffectives = response.data;
                var total = 0;
                $scope.reservationsEffectives.forEach(function(element){
                    total = total + Number(element.montant);
                });
                console.log(total);
                $scope.total = total; 


                
        
            },function error(response){
                console.log('erreur recup fiche');
                $scope.message = response.data.message;
                console.log($scope.message);

            })
        })();












    

});