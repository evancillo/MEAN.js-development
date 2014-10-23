'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Permission = mongoose.model('Permission'),
	Schema = mongoose.Schema;

/**
 * Folder Schema
 */
var FolderSchema = new Schema({
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
    }
});

mongoose.model('Folder', FolderSchema);