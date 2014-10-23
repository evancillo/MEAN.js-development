'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
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
    }
});

mongoose.model('Folder', FolderSchema);