'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Folder = mongoose.model('Folder'),
	_ = require('lodash');

/**
 * Create a Folder
 */
exports.create = function(req, res) {
	var folder = new Folder(req.body);
	folder.user = req.user;

	folder.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(folder);
		}
	});
};


exports.appendChild = function (req, res){

    console.log ("Se llama a appendChild con params", req.params);



    res.send({
        message: "response correcto!"
    })

}

exports.appendChildPOST = function (req, res){
    console.log ("Se llama a appendChildPOST con req", req.query);

    res.send({
        message: "SE PUDO HACER EN POST MIERDA :D!!!! "
    })
}



/**
 * Show the current Folder
 */
exports.read = function(req, res) {
	res.jsonp(req.folder);
};


exports.checkName = function(req, res){
    console.log("se llama checkName!!  con el req  nuevo", req.params);

    Folder.findOne({
        name: req.params.name,
        'user' : req.params.userId
    }).populate('user', 'displayName').exec(function(err, folder){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if (! folder){
            return res.send({
                message: 'No se encuentra Root',
                status: 0,
                data:[]
            });
        }
        else{
            return res.send({
                message: 'Usuario Ya posee Root',
                status: 1,
                data:[folder]
            })
        }
    });
};





/**
 * Update a Folder
 */
exports.update = function(req, res) {
	var folder = req.folder ;

	folder = _.extend(folder , req.body);

	folder.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(folder);
		}
	});
};

/**
 * Delete an Folder
 */
exports.delete = function(req, res) {
	var folder = req.folder ;

	folder.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(folder);
		}
	});
};

/**
 * List of Folders
 */
exports.list = function(req, res) { Folder.find().sort('-created').populate('user', 'displayName').exec(function(err, folders) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(folders);
		}
	});
};

/**
 * Folder middleware
 */
exports.folderByID = function(req, res, next, id) { Folder.findById(id).populate('user', 'displayName').exec(function(err, folder) {
		if (err) return next(err);
		if (! folder) return next(new Error('Failed to load Folder ' + id));
		req.folder = folder ;
		next();
	});
};

/**
 * Folder authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.folder.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
