/**
 * Created by sergio on 20-11-14.
 */

'use strict';

angular.module('folders').controller('ModalFoldersController', ['$scope','$modalInstance','folderItem','FileProperty', function($scope, $modalInstance, folderItem, FileProperty){

    $scope.folderItem = folderItem;
    $scope.fileProperty = FileProperty;

    $scope.ok = function(){
        $modalInstance.close();
    }

    $scope.cancel = function(){
        $modalInstance.dismiss();
    }

    $scope.delete = function(){
        $modalInstance.close({
            function: 'delete',
            item: folderItem
        })
    }

    M = $scope;
}]);

var M;