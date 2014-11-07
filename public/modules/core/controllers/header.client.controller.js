'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

        $scope.isNotHome = false;

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function(ev, data) {

			$scope.isCollapsed = false;
            if (data.name !="home"){
                $scope.isNotHome = true
            }else{
                $scope.isNotHome = false;
            }

		});

    H = $scope;
    }
]);

var H;
