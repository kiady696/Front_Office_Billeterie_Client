app.controller('TrajetController' , function($scope , $location , $http , $rootScope){


    function getAgeTarif(age){
        if(age >= 12){
            return 100;
        }else if(age < 12 && age >= 2){
            return 50;
        }else if(age < 2 ){
            return 10;
        }
    }


    $scope.getBillet = function(vol){
        console.log(vol.idvol);
        console.log(vol.idtrajet);
        console.log(vol.idavion);
        console.log(vol.villeorigine);
        console.log(vol.villedestination);
        console.log($rootScope.idPersonne);
        console.log($rootScope.agePersonne);

        //check place dans ce vol
        $http({
            method: 'GET',
            url: 'http://localhost/WebServicePHPReady/Vol/checkPlace/id/'+vol.idvol
        })
        .then( function success(response){
            $scope.message = response.data.message;
            console.log(response.data.message);
            console.log(response.data.data);
            console.log(response.data.status);

            if(response.data.status){
                $rootScope.idVolChoisi = response.data.data;
                $rootScope.villeorigine = vol.villeorigine;
                $rootScope.villedestination = vol.villedestination;
                console.log('Afaka maka billet amn\'ito vol ito fa mbola tsy feno' );
                console.log($rootScope.idVolChoisi);
                //get % tarif selon age
                $rootScope.tarifAge = getAgeTarif($rootScope.agePersonne);
                console.log($rootScope.tarifAge);
                $location.path("/Tarif/idvol/"+$rootScope.idVolChoisi);
            }

                

            

        }, function error(response){
            console.log(response.data.message);
            alert('error checking place libre');
        })

        //create a billet 



    }



    $scope.searchVol = function(searchInputs){
        console.log(searchInputs.villeorigine);
        console.log(searchInputs.villedestination);
        console.log(searchInputs.datevol);
        
        let url = '';
        if(searchInputs.villeorigine !== null && searchInputs.villeorigine !== undefined ){
            url = '/villeorigine/'+searchInputs.villeorigine;
        }
        if(searchInputs.villedestination !== null && searchInputs.villedestination !== undefined ){
            url = url+'/villedestination/'+searchInputs.villedestination;
        }
        if(searchInputs.datevol !== null && searchInputs.datevol !== undefined){
            var dateap = convert(searchInputs.datevol);
            url = url+'/datevol/'+dateap;
        }
        $http({
            method : 'GET' , 
            url : 'http://localhost/WebServicePHPReady/Vol/searchs'+url
        })
        .then(function success(response){
            $scope.vols = response.data;
        }, function error(response){
            alert ('erreur recherche');
        })


    }

    function convert(str) {
        var date = new Date(str),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }



});