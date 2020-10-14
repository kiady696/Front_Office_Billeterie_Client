app.controller('VolListController' , function($scope , $location , $http , $rootScope){
  

    $scope.getReservations = function(idvol){
        console.log("mbola ato am ReservationListController");
            console.log(idvol);
            $location.path('reservs/idvol/' + idvol); //mredirect eto makany am liste reservations
    }





    $scope.affList = (function(){
        $http({
            method: 'GET' , 
            url: 'http://localhost/WebServicePHPReady/Vol/vol/page/1'
        })
        .then(function success(response){
            $scope.vols = response.data.data
            $scope.pageCount = response.data.nbPage

        }, function error(response){
            alert('nisy erreur get trajet');
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