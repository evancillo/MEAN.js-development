'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Permission = mongoose.model('Permission'),
    File = mongoose.model('File'),
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
    folders:{
        type:[FolderSchema]
    },
    permissions:{
        type: [Permission]
    },
    files:{
        type: [File]
    }
});

FolderSchema.pre('save', function(){
    this.uuid = uuid.v1();
    next();
});

mongoose.model('Folder', FolderSchema);