'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var folders = require('../../app/controllers/folders');

	// Folders Routes
	app.route('/folders')
		.get(folders.list)
		.post(users.requiresLogin, folders.create);

	app.route('/folders/:folderId')
		.get(folders.read)
		.put(users.requiresLogin, folders.hasAuthorization, folders.update)
		.delete(users.requiresLogin, folders.hasAuthorization, folders.delete);

	// Finish by binding the Folder middleware
	app.param('folderId', folders.folderByID);
};