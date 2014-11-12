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

    app.route('/folder/appendChild/:parentId/folderName/:childName')
        .get(folders.appendChild);

    app.route('/folder/appendChildPOST')
        .post(folders.appendChildPOST);

    app.route('/folder/getFullTree')
        .post(folders.getFullTree);

    app.route('/folder/getFolderChildren')
        .post(folders.getFolderChildren)

    app.route('/folder/getRootFolder')
        .post(folders.getRootFolder)

    app.route('/file/upload')
        .post(folders.uploadFile)

    app.route('/folder/removeAllFolders')
        .post(folders.removeAllFolders);

    app.route('/file/removeAllFiles')
        .post(folders.removeAllFiles)

    app.route('/folder/removeFolder')
        .post(folders.removeFolder)

    app.route('/file/removeFile')
        .post(folders.removeFile)




    app.route('/folder/user/:userId/folderName/:name')
        .get(folders.checkName)

	// Finish by binding the Folder middleware
	app.param('folderId', folders.folderByID);
    app.param('userId', folders.checkName);
    app.param('name', folders.checkName);
    app.param('parentId', folders.appendChild);
    app.param('childName', folders.appendChild);
};