'use strict';

// Folders controller
angular.module('folders').controller('FoldersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Folders','$resource','RootFolder','RootFolderObj','FolderApi',
	function($scope, $stateParams, $location, Authentication, Folders, $resource, RootFolder, RootFolderObj, FolderApi ) {
		$scope.authentication = Authentication;

        $scope.folder = {
            new : "",
            actual: "",
            root: "",
            path:[]
        }
        //$scope.folder = [];

        /*

        function refreshRootFolder(){
             if ($scope.$$phase) { // most of the time it is "$digest"
                 applyFnc();
             } else {
                 $scope.$apply(applyFnc);
             }
        }

        var applyFnc = function (){
            $scope.folder.root = RootFolderObj.getFolder();
            var folders = []
            folders.push($scope.folder.root);
            $scope.folders = folders;

        }

        setTimeout(function(){
            refreshRootFolder();
        }, 500)

        */

        /*
        // agregar un nuevo directorio.
         var  addNewFolder = function(callback){
            if ($scope.folder.new != ""){
                console.log("se crea nuevo folder con nombre: "+ $scope.folder.new)

                var folder = new Folders ({
                    name: $scope.folder.new
                });

                folder.$save(function(response){
                    // limpia datos ingresados.
                    console.log("Se guarda foler exitosamente. ", response)
                    $scope.folder.new = ""
                   // $scope.find();
                     callback(response);

                }, function(errorResponse){
                    console.error("Error al guardar folder ", errorResponse)
                });

            }
        }

        function customUpdate(){
            var folder = $scope.folder.actual;
            folder.$update(function(resp){

            }, function(errorResponse){
                $scope.error = errorResponse.data.message;
            })
        }

        */

        function customFindOne(folder, callback){

             Folders.get({
                        folderId: folder._id
                    }, function(resp){
                         callback(resp);
             });
        }

        $scope.setIcon = function (type){
            switch (type){
                case 'folder':
                    return "dms-icon-folder"
                    break;

            }
        }




        function getFullTree (parentId){
            FolderApi.getFullTree(parentId)
        }

        function getFolderChildren(parentId){
            FolderApi.getFolderChildren(parentId, function(resp){
                $scope.folders = resp.data
            })
        }

        function getRootFolder(){
            FolderApi.getRootFolder($scope.authentication.user._id, function(resp){
               $scope.folders = resp.data;
               $scope.folder.root = resp.data[0];
            });
        }
        getRootFolder();


        $scope.appendChildFolder = function(){

            FolderApi.appendChildPOST($scope.folder.actual._id, $scope.folder.new, function(resp){
                console.log ("Se agrega Child ", resp);
                $scope.folders.push(resp.data[0]);
            })
        }

        $scope.goIntoFolder = function(folder){
            customFindOne(folder, function(resp){
                console.log("Se recibe respuesta dentro del callback! ", resp);
                $scope.folder.actual = resp;
                $scope.folder.path.push(folder.name);

                getFolderChildren($scope.folder.actual._id);

            });

        }



















		// Create new Folder
		$scope.create = function() {
			// Create new Folder object

            console.log("Se llama a create!")
			var folder = new Folders ({
                name: this.name

			});

			// Redirect after save
			folder.$save(function(response) {
				$location.path('folders/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Folder
		$scope.remove = function( folder ) {
			if ( folder ) { folder.$remove();

				for (var i in $scope.folders ) {
					if ($scope.folders [i] === folder ) {
						$scope.folders.splice(i, 1);
					}
				}
			} else {
				$scope.folder.$remove(function() {
					$location.path('folders');
				});
			}
		};

		// Update existing Folder
		$scope.update = function() {
			var folder = $scope.folder ;

			folder.$update(function() {
				$location.path('folders/' + folder._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Folders
		$scope.find = function() {
			$scope.folders = Folders.query();
		};

		// Find existing Folder
		$scope.findOne = function() {
			$scope.folder = Folders.get({ 
				folderId: $stateParams.folderId
			});
		};









        S = $scope;
	}
]);

var S