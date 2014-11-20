/**
 * Created by sergio on 20-11-14.
 */

'use strict';

angular.module('folders').controller('ModalFoldersController', ['$scope','$modalInstance', function($scope, $modalInstance){

    $scope.ok = function(){
        $modalInstance.close();
    }

    $scope.cancel = function(){
        $modalInstance.dismiss();
    }
}]);