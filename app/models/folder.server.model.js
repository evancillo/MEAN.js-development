'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),


    Permission = require('../models/permission.server.model').Model,
    File = require('../models/file.server.model').Model,
    uuid = require('node-uuid'),
    materializedPlugin = require('mongoose-materialized'),
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
    ],
    files:[
        {
            type: Schema.ObjectId,
            ref: 'File'
        }
    ]
    ,
    permissions:[
        {
        type: Schema.ObjectId,
        ref: 'Permission'
        }
    ]


});

FolderSchema.plugin(materializedPlugin);


FolderSchema.pre('save', function(next){
    this.uuid = uuid.v1();
    next();
});

mongoose.model('Folder', FolderSchema);