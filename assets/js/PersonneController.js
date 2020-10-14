app.controller('PersonneController' , function($scope , $location , $http , $rootScope){

    $scope.register = function(personne){
        console.log(personne.nom);
        console.log(personne.age);
        //enregistrer(insert) dans la base table personne

        var datas = {
            nom : personne.nom,
            age : personne.age
        };

        $http({
            method: 'PUT' , 
            url:'http://localhost/WebServicePHPReady/Personne/',
            data: datas , 
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
        .then( function success(response){
            $scope.message = response.data.message;
            //enregistrer dans $rootScope.idPersonne et $rootScope.agePersonne
            $rootScope.agePersonne = personne.age;
            $rootScope.idPersonne = response.data.data;
            console.log($rootScope.idPersonne);
            console.log($rootScope.agePersonne);

            setTimeout((function(){
                $scope.message = response.data.message;
                //body.style.backgroundColor = '#3BA'
            }),900);

            $location.path('/choixTrajet');

        } , function error(response){
            $scope.message = response.data.message;
        });
    }



});