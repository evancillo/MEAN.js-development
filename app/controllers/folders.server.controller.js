'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Folder = mongoose.model('Folder'),
    File = mongoose.model('File'),
    fs = require('fs'),
    rmdir = require('rimraf'),
    mkdirp = require('mkdirp'),
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

exports.removeAllFiles = function (req, res){
    var files = File.find().remove();
    files.exec();

    res.send({
       msg: 'se borran todos los archivos'
    })
}
exports.removeAllFolders = function (req, res){
    var folders = Folder.find().remove();
    folders.exec();

    res.send({
        msg: 'se borran los directorios'
    })
}



exports.appendChild = function (req, res){

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

exports.uploadFile = function (req, res){
    /*
    var query = File.find().remove();
    query.exec(); */

    var fstream;
    req.pipe(req.busboy);

    req.busboy.on('field', function(fieldname, val) {
         console.log("se recibe FIELD", fieldname, val);
        req.body[fieldname] = val;
    });

    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        console.log("Subiendo FILE: " + filename)
        console.log("mimeType: ", mimetype)
        console.log("req.body", req.body)
        console.log("req.headers ", req.headers)

        var fileModel = new File({
            name: filename,
            visibleName: filename,
            type: mimetype,
            url: req.headers.origin+ '/uploads/'+req.body._id+'/' + filename,
            size: req.headers['content-length']
        });


        fileModel.save(function(err){
            if (err) console.log("error en save fileModel ", err) ;
            console.log ("********** Se guarda fileModel ", fileModel)
        });

        Folder.findById(req.body._id, function(err, folder){
            if (err) console.log("error en findById folder ", err);

            folder.files.push(fileModel);
            folder.save();

        });

        Folder.findById(req.body._id)
            .populate('files')
            .exec( function(err, fold){
                if (err) console.log("error en populate ", err) ;

                // console.log("AHORA SI folder actualizado", fold);
                 res.send({
                    msg:'se agrega file correctamente',
                    folder: fileModel,
                    status: 1
                })

            });



        mkdirp('/opt/mean/public/uploads/'+req.body._id, function(err){
            //Path where image will be uploaded
            var fstream = fs.createWriteStream('/opt/mean/public/uploads/'+req.body._id+'/' + filename);
            file.pipe(fstream);
           /* fstream.on('close', function () {
               // console.log("Upload Finished of " + filename);
                 res.redirect('back');          //where to go next
            }); */
        });




    });
    /*
    req.busboy.on('finish', function(){



    }); */

}

exports.removeFolder = function (req, res){

    Folder.findById(req.query._id, function(err, doc){

        if (err){
            return  res.send({
                msg:'hubo un error al intentar borrar',
                status: 0

            })

        }

        doc.getChildren(function(err, children){

            if (err){
                return  res.send({
                    msg:'hubo un error al intentar borrar',
                    status: 0
                })
            }

            if (!children)
                console.log('No children que borrar');

            if (children){
                for (var i = 0; i < children.length; i++){
                    var folder = children[i];
                    for(var j = 0; j< folder.files.length; j++){
                        File.findByIdAndRemove(folder.files[j]._id, function(err){
                        })
                    }
                    Folder.findById(folder._id, function(err, doc){
                        if (err)
                            console.log("error al borrar children");
                        doc.remove();
                    });
                    rmdir('/opt/mean/public/uploads/'+folder._id, function(err){
                       if (err)
                           console.log('error al borrar el directorio físico id: ', folder._id)
                    })
                }
            }
        })


        for (var i = 0; i < doc.files.length; i++){
            File.findByIdAndRemove(doc.files[i]._id, function(err){
            })
        }

        doc.remove();

        rmdir('/opt/mean/public/uploads/'+req.query._id, function(err){
            if (err) console.log('error al borrar el directorio fisico padre id')

        })

        res.send({
            mgs: 'borrando folder and children and its files',
            status: 1,
            file: req.query._id
        })

    })


}
exports.removeFile = function (req, res){

    Folder.findById(req.query.parentId, function(err, doc){

        if (!doc){
            res.send({
                msg: 'no se encuentra folder',
                status: 0
            })
        }else{

            var index = doc.files.indexOf(req.query._id);
            doc.files.splice(index, 1);
            doc.save();


            res.send({
                msg: 'se borra file 3',
                status: 1,
                children: doc.files,
                file: req.query._id
            });

            fs.unlink('/opt/mean/public/uploads/'+req.query.parentId+'/'+req.query.name, function(err, path){
                if (err){

                }else{
                    console.log("archivo borrado ", path);
                }
            });

            File.findByIdAndRemove(req.query._id, function(err){

            })

        }
    })
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
                   /*
                   var populateChilds = [];

                   for (var i = 0; i < childs.length; i++){

                       Folder.findById(childs[i]._id)
                           .populate('files')
                           .exec( function(err, fold){
                               if (err) console.log("error en populate ", err) ;

                               populateChilds.push(fold);

                           });
                   } */
                   Folder.findById(req.query.parentId)
                       .populate('files')
                       .exec(function(err, folder){
                           if (err) console.log("error en populate ", err);

                           console.log("Folder populado ", folder);

                           for (var i = 0; i < folder.files.length; i++){
                               childs.push(folder.files[i]);
                           }

                           return res.send({
                               message: 'Se envían Children populados :D',
                               status: 1,
                               data: childs
                           })

                       });
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
