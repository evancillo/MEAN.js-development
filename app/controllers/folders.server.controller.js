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

    Folder.findById(req.query.parentId, function(err, doc){

        if (err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if (!doc){
            return res.send({
                message: 'no se encuentra folder por ID',
                status: 0,
                data:[]
            })
        }
        else{
           doc.appendChild({
               name: req.query.childName
           }, function(error, data){
               if(error){
                   return res.status(400).send({
                       message: errorHandler.getErrorMessage(error)
                   });
               }
               if(!data){
                   return res.send({
                       message: 'me falló el append',
                       status: 0,
                       data:[]
                   })

               }else{
                   return res.send({
                       message: 'Todo bien por acá',
                       status: 1,
                       data:[data]
                   })

               }
           })

        }

    });
}

exports.getFullTree = function(req, res){
    Folder.GetArrayTree(req.query.parentId, function(err, tree){
        if (err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if (!tree){
            return res.send({
                message: 'No se encontró TREE',
                status: 0,
                data:[]
            })
        }else{
            return res.send({
                message: 'Se encuentra tree',
                status: 1,
                data: tree
            })
        }
    })
}

exports.getFolderChildren = function (req, res){
    Folder.findById(req.query.parentId, function(err, doc){
        if (err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if (!doc){
            return res.send({
                message: 'no se encuentra folder por ID',
                status: 0,
                data:[]
            })
        }
        else{

           doc.getChildren(function(err, childs){

               if (err){
                   return res.status(400).send({
                       message: errorHandler.getErrorMessage(err)
                   });
               }
               if (!childs){
                   return res.send({
                       message: 'No se encuentran Children',
                       status: 0,
                       data:[]
                   })
               } else{
                   return res.send({
                       message: 'Se envían Children',
                       status: 1,
                       data: childs
                   })
               }


           })
        }
    });
    /*
    Folder.GetChildren(req.query.parentId, function(err, docs){
        if (err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if (!docs){
            return res.send({
                message: 'No se encuentra doc',
                status: 0,
                data:[]
            })
        }else{
            return res.send({
                message: 'Se envian Children',
                status: 1,
                data: docs
            })
        }
    }) */
}

exports.getRootFolder = function (req, res){
    Folder.findOne({name: req.query.userId}, function(err, root){
        if (err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if(!root){
            var rootFolder = new Folder({name: req.query.userId});
            rootFolder.save(function(error, folder){
                if (error){
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(error)
                    });
                }
                if (!folder){
                    return res.send({
                        message: 'No se puede crear Root',
                        status: 0,
                        data: [folder]
                    })
                }else{
                    return res.send({
                        message: 'se crea nuevo root',
                        status: 1,
                        data: [folder]
                    })
                }
            })
        }else{
            return res.send({
                message: 'Se encuentra Root',
                status: 1,
                data: [root]
            })
        }
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
