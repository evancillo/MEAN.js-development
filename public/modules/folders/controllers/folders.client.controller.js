'use strict';

// Folders controller
angular.module('folders').controller('FoldersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Folders','$resource','RootFolder',
	function($scope, $stateParams, $location, Authentication, Folders, $resource, RootFolder ) {
		$scope.authentication = Authentication;
        $scope.folder = {
            new : "",
            actual: "",
            root: RootFolder.getRootFolder()
        }

        
        // agregar un nuevo directorio.
        $scope.addNewFolder = function(){
            if ($scope.folder.new != ""){
                console.log("se crea nuevo folder con nombre: "+ $scope.folder.new)

                var folder = new Folders ({
                    name: $scope.folder.new
                });

                folder.$save(function(response){
                    // limpia datos ingresados.
                    console.log("Se guarda foler exitosamente. ", response)
                    $scope.folder.new = ""
                    $scope.find();

                }, function(errorResponse){
                    console.error("Error al guardar folder ", errorResponse)
                });

            }
        }

        $scope.setIcon = function (type){
            switch (type){
                case 'folder':
                    return "dms-icon-folder"
                    break;

            }
        }

        $scope.addChildFolder = function(){


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