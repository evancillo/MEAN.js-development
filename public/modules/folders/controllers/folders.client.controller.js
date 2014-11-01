'use strict';

// Folders controller
angular.module('folders').controller('FoldersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Folders','$resource','RootFolder','RootFolderObj','FolderApi','$filter','FileUploader',
	function($scope, $stateParams, $location, Authentication, Folders, $resource, RootFolder, RootFolderObj, FolderApi, $filter,FileUploader ) {
		$scope.authentication = Authentication;
        $scope.uploader = new FileUploader();

        $scope.folder = {
            new : "",
            actual: "",
            root: "",
            path:[]
        }
        $scope.breadcrumbs = [];
        var visitedFolders = [];



        function addToPathFolders (folder){
           var hasTheId = $filter('filter')(visitedFolders, function (d) {return d._id === folder._id;});
            if (hasTheId.length == 0){
                visitedFolders.push(folder)
            }

            $scope.breadcrumbs = $scope.getBreadcrum();
        }

        $scope.getVisitedFolders = function (){
            return visitedFolders;
        }

        $scope.getBreadcrum = function(){

           var paths = $scope.folder.actual.path.split(',')

           var lastPath = {
               _id: $scope.folder.actual._id,
               name: $scope.folder.actual.name
           }

           var breadCrums = [];

            for (var i = 0; i < paths.length; i++){

                if (paths[i]!= ""){
                    var folder = $filter('filter')(visitedFolders, function (d) {return d._id === paths[i];})[0];

                    var pathWithName = {
                        _id : folder._id,
                        name: folder.name
                    }

                    breadCrums.push(pathWithName)
                }
            }
            breadCrums.push(lastPath);

            return breadCrums
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
                $scope.folder.new="";
            })
        }

        $scope.goIntoFolder = function(folder){
            customFindOne(folder, function(resp){
                console.log("Se recibe respuesta dentro del callback! ", resp);
                $scope.folder.actual = resp;
                $scope.folder.path.push(folder.name);

                getFolderChildren($scope.folder.actual._id);

                addToPathFolders($scope.folder.actual);

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