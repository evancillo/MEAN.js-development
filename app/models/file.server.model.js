/**
 * Created by sergio on 23-10-14.
 */

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    uuid = require('node-uuid'),
    Schema = mongoose.Schema;


var FileSchema = new Schema ({
    uuid:{
        type: String,
        unique: true
    },

    name:{
        type: String,
        required: true
    },
    visibleName:{
        type: String
    },

    created:{
        type: Date,
        default: Date.now
    },
    updated:{
        type: Date
    },
    type:{
        type: String
    },
    url:{
        type: String,
        trim: true
    },
    version:{
        type: Number,
        default: 1
    },
    size:{
        type: Number
       // trim: true
    }
});


FileSchema.pre('save', function(next){
    this.uuid = uuid.v1();
    next();
});

var Model = mongoose.model('File', FileSchema);

module.exports = {
    Model:Model
}