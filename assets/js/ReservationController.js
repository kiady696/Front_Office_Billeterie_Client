app.controller('ReservationController' , function($scope , $location , $http , $rootScope){
    

    $scope.valider = function(idpersonne){
        console.log($scope.date);
        
        //verifier si le $scope.idbillet est deja dans la table reservation
        $http({
            method: 'GET' , 
            url : 'http://localhost/WebServicePHPReady/Reservation/checkDoublon/idbillet/'+$scope.idbillet
        })
        .then(function success(response){
            $scope.doublonSpotted = response.data.status;
            

            if(!$scope.doublonSpotted){
                var datas = {
                    idbillet: $scope.idbillet ,
                    idpersonne: $scope.idpersonne , 
                    idvol : $scope.idvol , 
                    tarifPassager: $rootScope.tarifAge ,
                    tarifconditionmodifiable : $rootScope.tarifconditionmodifiable ,
                    tarifconditionremboursable : $rootScope.tarifconditionremboursable ,
                    montant : $scope.montant , 
                    dateachat : $rootScope.datevol
                };
        
        
        
                $http({
                    method:'PUT' , 
                    url: 'http://localhost/WebServicePHPReady/Billet/' , 
                    data: datas , 
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    }
                })
                .then(function success(response){
                    console.log(response.data);
                    //Mi-insert anaty reservation indray zao eeeee
                    var dataReserv = {
                        idvol: $scope.idvol , 
                        idbillet : $scope.idbillet , 
                        etat : 0
                    };
                    $http({
                        method: 'PUT' , 
                        url: 'http://localhost/WebServicePHPReady/Reservation/' ,
                        data: dataReserv , 
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        }
                    })
                    .then(function success(response){
                        $scope.message = response.data.message;
                        // Ahena ny volan'ilay olona
                        var dataa = {
                            idpersonne : idpersonne , 
                            montant : $scope.montant
                        };
                        $http({
                            method:'PUT' , 
                            url : 'http://localhost/WebServicePHPReady/Personne/achat' , 
                            data : dataa ,
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            } 

                        })
                        .then(function success(response){

                        } , function error (response){

                        });
                    } , function error(response){
                        alert('erreur enregistrement reservation!');
                    });
        
        
        
                }, function error(response){
                    alert('erreur insertion billet');
                });
            }else{
                $scope.message = 'Billet déjà enregistré et Vol déjà réservé';
            }

        }, function error(response){
            alert('erreur check billet doublon');
        })

        
        

        
    }

    $scope.affBillet = (function(){

        //generate idbillet
        $http({
            method: 'GET' , 
            url : 'http://localhost/WebServicePHPReady/Billet/getIdBillet'
        })
        .then(function success(response){
            $scope.idbillet = response.data.id;

            $rootScope.dateAchatDuBillet = response.data.date;

            $scope.date = $rootScope.datevol;
            $scope.idpersonne = $rootScope.idPersonne;
            $scope.idvol = $rootScope.idVolChoisi;
            $scope.villeorigine = $rootScope.villeorigine;
            $scope.villedestination = $rootScope.villedestination;


            if($rootScope.choixModifiable){
                $scope.modifiable = 'Oui';
            }else{
                $scope.modifiable = 'Non';
                $scope.remiseMod = '(-'+$rootScope.tauxModifiable+'%)';
            }
            if($rootScope.choixRemboursable){
                $scope.remboursable = 'Oui';
            }else{
                $scope.remboursable = 'Non';
                $scope.remiseRemb = '(-'+$rootScope.tauxRemboursable+'%)';
            }
            $scope.montant = $rootScope.montantFinal;
            


        } , function error(response){
            alert('error displaying billet');
        })

    })();

    $scope.export = function(){
        html2canvas(document.getElementById('exportthis'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                pdfMake.createPdf(docDefinition).download("test.pdf");
            }
        });
    }

    




});