var mongoose = require('mongoose');


console.log("Attempting to start Mongo Server");
var db = mongoose.connect('mongodb://localhost/photo_app');


var schema = new mongoose.Schema({
	name: String,
	path: String
});

module.exports = mongoose.model('Photo', schema);