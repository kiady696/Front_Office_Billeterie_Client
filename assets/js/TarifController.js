app.controller('TarifController' , function($scope , $location , $http , $rootScope){


     $scope.getValeurschoix = (function(){
        var url = $location.url();
        //split it with '/' to get the third party which is the idVol
        var urlArray = url.split('/');
        var idvol = urlArray[3];

        $http({
            method:'GET' , 
            url:'http://localhost/WebServicePHPReady/Tarif/choix/idvol/'+idvol
        })
        .then(function success(response){
            //mameno $rootScope.choixDesignation = valeur des choix dans la base
            $rootScope.tauxModifiable = response.data.valeurmod;
            $rootScope.tauxRemboursable = response.data.valeurremb;
        }, function error(response){
            alert('error getting choix tarifaires');
        })
    })(); 

    function getMontantFinal(tarifPlein , pourcentageTarifAge , choixModifiable , tauxModifiable , choixRemboursable , tauxRemboursable){
        let montantFinal = (tarifPlein*pourcentageTarifAge) / 100;
        var deduction = 0;
        if(!choixModifiable){
            deduction += (tarifPlein * tauxModifiable) / 100;
        }
        if(!choixRemboursable){
            deduction += (tarifPlein * tauxRemboursable) / 100;
        }
        montantFinal = montantFinal - deduction;
        return montantFinal;
    }


    $scope.submitChoices = function(tarifChoicesInput){
        console.log(tarifChoicesInput.modifiable);
        console.log(tarifChoicesInput.remboursable);
        if( tarifChoicesInput.modifiable !== undefined && tarifChoicesInput.modifiable !== null && tarifChoicesInput.remboursable !== undefined && tarifChoicesInput.remboursable!== false){
            if(tarifChoicesInput.modifiable == 0){ //modifiable non
                $rootScope.choixModifiable = false;

                $rootScope.tarifconditionmodifiable = $rootScope.tauxModifiable;

            } else if(tarifChoicesInput.modifiable == 1){ //modifiable oui
                $rootScope.choixModifiable = true;

                $rootScope.tarifconditionmodifiable = 0;
            }
            if(tarifChoicesInput.remboursable == 0){ //Remboursable non
                $rootScope.choixRemboursable = false;

                $rootScope.tarifconditionremboursable = $rootScope.tauxRemboursable;

            } else if(tarifChoicesInput.remboursable == 1){ //Remboursable oui
                $rootScope.choixRemboursable = true;

                $rootScope.tarifconditionremboursable = 0;
            }

            var url = $location.url();
            //split it with '/' to get the third party which is the idVol
            var urlArray = url.split('/');
            var idvol = urlArray[3];
            console.log(idvol);

            //get tarif Plein de ce vol
            $http({
                method: 'GET',
                url:'http://localhost/WebServicePHPReady/Tarif/tarifss/idvol/'+idvol
            })
            .then(function success(response){
                //calcul montant final
                console.log(response.data.data);
                $scope.message = response.data.message;
                $rootScope.tarifPlein = response.data.data.montant;
                console.log($rootScope.tarifPlein);
                
                var montantFinal = getMontantFinal($rootScope.tarifPlein , $rootScope.tarifAge , $rootScope.choixModifiable , $rootScope.tauxModifiable , $rootScope.choixRemboursable , $rootScope.tauxRemboursable );

                console.log(montantFinal);

                $rootScope.montantFinal = montantFinal;
                
                $location.path("/affBillet");



            }, function error(response){
                alert('error getting tarif plein');
            })


        }else{
            $location.path('/');
        }

    }

});