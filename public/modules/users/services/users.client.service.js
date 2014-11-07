'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('users').factory ('UsersHandsOn', ['$resource', function($resource){

    return {

        getAllUsers : function(callback){
            var resourse = $resource('/users/getAllUsers');

            resourse.save(function(resp){
               callback(resp)
            });
        }
    }

}]);