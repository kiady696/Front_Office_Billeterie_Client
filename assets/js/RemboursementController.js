app.controller('RemboursementController' , function($scope , $location , $http , $rootScope){

    //feed dropdown billet 
    $scope.getBillets = (function(){
        $http({
            method:'GET',
            url:'http://localhost/WebServicePHPReady/Billet'
        })
        .then(function success(response){
            $scope.listDropdownBillet = response.data;
        }, function error(response){
            alert('error getting tarif plein de ce vol!');
        })
    })();

    function convert(str) {
        var date = new Date(str),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }

    $scope.rembourser = function(event , rembinputs){
        console.log(rembinputs.idbillet);
        console.log(rembinputs.montantRemb);
        console.log(rembinputs.date);
        var dateRemboursement = convert(rembinputs.date);
        //check if date < date d'aujourd'hui
        if(rembinputs.date < new Date()){
            $scope.message = "Date invalide";
        }else{
            console.log('authorized to send xhr');
            var dataa = {
                idbillet: rembinputs.idbillet ,
                montantRemb: rembinputs.montantRemb ,
                dateRemb : dateRemboursement,
                //APIANA penalite eto raha variena ilay penalite ex: if($rootScope.dateAchatDuBillet - rembinputs.date > 20 jours){penalite = 20} 
                penalite : 10
            }
            $http({
                method: 'PUT' , 
                url : 'http://localhost/WebServicePHPReady/Billet/check' , 
                data : dataa , 
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                } 

            })
            .then(function success(response){
                $scope.message = response.data.message;

            }, function error(response){
                $scope.message = response.data.message;
            })

        }
        

        //check if montant remboursé < billet.montant ou > billet.montant
        
        // check if billet non remboursable

        
    }

});