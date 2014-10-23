/**
 * Created by sergio on 22-10-14.
 */

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    uuid = require('node-uuid'),
    Schema = mongoose.Schema;


var PermissionSchema = new Schema ({
    uuid:{
        type: String,
        unique: true
    },
    email:{
        type: String,
        trim: true,
        required: true
    },
    created:{
        type: Date,
        default: Date.now
    },
    updated:{
        type: Date
    },
    granted:{
        type: String
    },
    value:{
        type: Number
    }
});

PermissionSchema.pre('save', function(){
    this.uuid = uuid.v1();
    next();
});

mongoose.model('Permission', PermissionSchema);