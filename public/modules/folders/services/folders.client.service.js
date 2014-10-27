'use strict';

//Folders service used to communicate Folders REST endpoints
angular.module('folders').factory('Folders', ['$resource',
	function($resource) {
		return $resource('folders/:folderId', { folderId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});

       /* return $resource('folders/',{},{
            update:{
                method: 'PUT'
            }
        }) */
	}
]);



angular.module('folders').factory('FolderApi', ['$resource', function($resource){



    return {

        appendChildFolder: function(parentId, childName){

            var data = {
                parentId: parentId,
                childName : childName
            }

            var resource = $resource ('/folder/appendChild/:parentId/folderName/:childName', data);

            return resource.get()
        },

        appendChildPOST: function(parentId, childName){
            var data = {
                parentId: parentId,
                childName: childName
            }

            var resource = $resource('/folder/appendChildPOST', data);

            return resource.save();
        }
    }

}]);