'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;
        console.log("SE ENTRA A MODULO USERS")

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/folders');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/folders');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

                console.log("usuario autenticado! ");

				// And redirect to the index page
				$location.path('/folders');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);