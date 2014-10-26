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