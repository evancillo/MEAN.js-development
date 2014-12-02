'use strict';

// Folders controller
angular.module('folders').controller('FoldersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Folders','$resource','FolderApi','$filter','FileUploader','$timeout','UsersHandsOn','$modal','FileProperty',
	function($scope, $stateParams, $location, Authentication, Folders, $resource, FolderApi, $filter,FileUploader, $timeout, UsersHandsOn, $modal, FileProperty ) {
		$scope.authentication = Authentication;
        $scope.fileProperty = FileProperty;

        $scope.uploader = new FileUploader({
            removeAfterUpload: true
        });

        UsersHandsOn.getAllUsers(function(resp){
            $scope.userList = resp;
        })

        $scope.folder = {
            new : "",
            actual: "",
            root: "",
            path:[]
        }
        $scope.breadcrumbs = [];
        var visitedFolders = [];


        //<editor-fold desc="Alert">
        /* Sección para Alert*/
        $scope.alerts = [];
        var alert = {
            msg: 'Se agregó correctamente el directorio.',
            type: 'success'
        };
        alert.close = function(){
            $scope.alerts.splice($scope.alerts.indexOf(this), 1);
        }
        //</editor-fold>





        $scope.filterFolderList = function(item){
            if (item.type!="folder")
                return true;

           if(typeof $scope.folder.actual._id == "undefined"){
               return true;
           }
           else{
               if(item.parentId == $scope.folder.actual._id)
                   return true;
               return false;
           }
        }

        $scope.deleteItem = function(item){

            item['parentId'] = $scope.folder.actual._id;
            FolderApi.removeItem(item, function(resp){
                console.log(resp);

                var index = $scope.folders.map(function(x) {return x._id; }).indexOf(resp.file);
                $scope.folders.splice(index, 1);

                var alertSuccess = {
                    type: 'success',
                    msg: 'eliminado correctamente'
                }

                $scope.alerts.push(alertSuccess);
                $timeout(function(){
                    $scope.alerts.splice($scope.alerts.indexOf(alertSuccess), 1);
                }, 2000); // maybe '}, 3000, false);' to avoid calling apply
            });
        }

        $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
            //console.info('onCompleteItem', fileItem, response, status, headers);
        };

        $scope.uploader.onSuccessItem = function(item, response, status, headers){
            var alertSuccess = {
                type: 'success',
                msg: 'Archivo subido correctamente'
            }

            $scope.folders.push(response.folder);

            $scope.alerts.push(alertSuccess);
            $timeout(function(){
                $scope.alerts.splice($scope.alerts.indexOf(alertSuccess), 1);
            }, 2000); // maybe '}, 3000, false);' to avoid calling apply

        }

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

        $scope.hideProgressbar = function (){
            return isNaN($scope.uploader.progress)
        }

        $scope.getBreadcrum = function(){

           var paths = $scope.folder.actual.path.split(',')

           var lastPath = {
               _id: $scope.folder.actual._id,
               name: $scope.folder.actual.name,
               type: $scope.folder.actual.type
           }

           var breadCrums = [];

            for (var i = 0; i < paths.length; i++){

                if (paths[i]!= ""){
                    var folder = $filter('filter')(visitedFolders, function (d) {return d._id === paths[i];})[0];

                    var pathWithName = {
                        _id : folder._id,
                        name: folder.name,
                        type: folder.type
                    }

                    breadCrums.push(pathWithName)
                }
            }
            breadCrums.push(lastPath);

            return breadCrums
        }

        $scope.getCurrentFolder = function(){
            return FolderApi.getCurrentFolder();
        }

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

        function customFindOne(folder, callback){

             Folders.get({
                        folderId: folder._id
                    }, function(resp){
                         callback(resp);
             });
        }

        function getFullTree (parentId){
            FolderApi.getFullTree(parentId)
        }

        function getFolderChildren(parentId){
            FolderApi.getFolderChildren(parentId, function(resp){
                $scope.folders = resp.data
            })
        }

        $scope.appendChildFolder = function(){

            FolderApi.appendChildPOST($scope.folder.actual._id, $scope.folder.new, function(resp){
                console.log ("Se agrega Child ", resp);
                $scope.folders.push(resp.data[0]);
                $scope.folder.new="";

                /*
                $scope.alerts.push(alert);
                $timeout(function(){
                    $scope.alerts.splice($scope.alerts.indexOf(alert), 1);
                }, 2000); // maybe '}, 3000, false);' to avoid calling apply */

            })
        }

        $scope.goIntoFolder = function(folder){

            if (folder.type != "folder") return;
            $scope.folders.length = 0;
            customFindOne(folder, function(resp){
                if (resp._id == $scope.folder.root._id)
                    resp.name = "Home"
                FolderApi.setCurrentFolder(resp);
                $scope.folder.actual = resp;
                $scope.folder.path.push(folder.name);

                getFolderChildren($scope.folder.actual._id);

                addToPathFolders($scope.folder.actual);

            });

        }



        //<editor-fold desc="Logica del Folders Modal">
        $scope.folderModal = function (item) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/folders/views/modal.folder.client.view.html',
                controller: 'ModalFoldersController',
                size: 'lg',
                resolve: {
                    folderItem: function () {
                        return item;
                    }
                }
            });

            modalInstance.result.then(function (result) {

                switch (result.function){
                    case 'delete':
                        $scope.deleteItem(result.item);
                        break;

                }

            }, function () {
               // $log.info('Modal dismissed at: ' + new Date());
            });
        };
        //</editor-fold>

        //<editor-fold desc="Metodos Privados, no publicar">
        $scope.removeAllFiles = function(){
            FolderApi.removeAllFiles (function(resp){
                console.log("Se borran todos los archivos: ", resp);
            });
        };

        $scope.removeAllFolders = function(){
            FolderApi.removeAllFolders(function(resp){
                console.log("Se borran todos los folders: ", resp)
            });
        };
        //</editor-fold>

        //<editor-fold desc="Logica del boilplate, sin usar">
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
        //</editor-fold>







        FolderApi.getRootFolder($scope.authentication.user._id, function(resp){
            var response = resp.data;
            response[0].name = "Home"

            $scope.folders = response;
            $scope.folder.root = response[0];

            $scope.goIntoFolder(response[0]);
        });


        S = $scope;
	}
]);

var S