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

        appendChildPOST: function(parentId, childName, callback){
            var data = {
                parentId: parentId,
                childName: childName
            }

            var resource = $resource('/folder/appendChildPOST', data);

             resource.save(function(resp){
                 callback(resp)
             });
        },

        getFullTree: function (parentId){

            var data = {
                parentId: parentId
            }

            var resource = $resource ('/folder/getFullTree', data);

            return resource.save();
        },

        getFolderChildren: function (parentId, callback){
            var data = { parentId: parentId }

            var resource = $resource ('/folder/getFolderChildren', data)

            resource.save (function (resp){
                callback(resp);
            })
        },

        getRootFolder: function (userId, callback){
            var data = {userId: userId};

            var resouce = $resource ('/folder/getRootFolder', data);

            resouce.save (function(resp){
                callback(resp);
            })
        }

    }

}]);