
    app.directive("basicInputDirective" , function(){
        return{
            require: 'ngModel',
            // restrict: 'AE'
            link: function(scope , element , attrs , controller){
                controller.$validators.myValidator = function(inputValue){
                
                    // console.log(modelValue);   MITOVY IHANY ILAY model Value sy ilay View VAlue
                    // console.log(viewValue);
                    var BasicRegExp = /^[A-Za-z]+[a-z0-9-\']+/i;

                    //En temps réel no ijerena ilay inputValue
                    // var valid = (inputValue && inputValue.length > 0) || false;
                    var valid = BasicRegExp.test(inputValue);
                    //console.log(valid);
                    return valid; 
                    

                };
            }

        };
    });

    app.directive('stringToNumber', function() {
      return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
          ngModel.$parsers.push(function(value) {
            return '' + value;
          });
          ngModel.$formatters.push(function(value) {
            return parseFloat(value);
          });
        }
      };
    });


    // CUSTOM VALIDATION     

    // app.directive('number', function() {
    //     var NUMBER_REGEXP = /^(\d+)$/;
    //     return {
    //       require: 'ngModel',
    //       link: function(scope, elm, attrs, ctrl) {
    //         ctrl.$validators.number = function(modelValue, viewValue) {
    //           return NUMBER_REGEXP.test(viewValue);
    //         };
    //       }
    //     };
    //   });

    // HTML VIEW

/* <form name="form">
  <div class="form-group"
       ng-class="{'has-error': form.value.$dirty && form.value.$error.number}">
    <label for="id_value" class="control-label">Value:</label>
    <div>
      <input type="text" class="form-control" id="id_value" name="value"
             ng-model="model.number" number>
      <p class="help-block" ng-if="form.value.$error.number">Please enter a number</p>
    </div>
  </div>
</form> */