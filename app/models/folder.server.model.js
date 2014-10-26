'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),


    Permission = require('../models/permission.server.model').Model,
    File = require('../models/file.server.model').Model,
    uuid = require('node-uuid'),
	Schema = mongoose.Schema;

/**
 * Folder Schema
 */
var FolderSchema = new Schema({
    uuid:{
        type: String,
        unique: true
    },
	name: {
		type: String,
		default: '',
		required: 'Please fill Folder name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	type:{
        type: String,
        default:'folder'
    },
    folders:[
        {
            type: Schema.ObjectId,
            ref: 'Folder'
        }
    ]/*,
    permissions:{
        type: [Permission]
    },
    files:{
        type: [File]
    } */
});


FolderSchema.pre('save', function(next){
    this.uuid = uuid.v1();
    next();
});

mongoose.model('Folder', FolderSchema);