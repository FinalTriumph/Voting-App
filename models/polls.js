"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Poll = new Schema({
    poll: {
        id: ObjectId,
        author: String,
        title: String,
        options: Object,
        voted: Array
    }
});

module.exports = mongoose.model("Poll", Poll);