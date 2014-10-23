/**
 * Created by sergio on 22-10-14.
 */

'use strict';

// Configuring the Articles module
angular.module('folders').run(['Menus',
                function(Menus) {
                    		// Set top bar menu items
                      		Menus.addMenuItem('topbar', 'my box', 'folders' );//, 'dropdown', '/folders');
                    		//Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
                    		//Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
                    	}
]);
