var Photo = require('./models/Photos.js');
var fs = require('fs');
var pathJoin = require('path');

var Errfile = pathJoin.join(__dirname,'database_err.txt');

var Foundphotos;

console.log("Attempting to clear bad files");

exports.clear = function(){
	Photo.find({},function(err,photos){
	if (err){
		fs.writeFile(Errfile,err+'\n',{flag: 'a+'},function(err){
			if(err) throw err;
			console.log("Photo model error written to file");
		});
	}

	photos.forEach(function(photo){
	var filePath = pathJoin.join('./public/photos',photo.path);

	fs.open(filePath,'r',function(err,file){
		if(err) {
			/**fs.writeFile(Errfile,err+'\n'+photo.path+'\n',{flag:'a+'},function(err){
				if(err) throw err;
				console.log("Error written");
			});
**/			console.log("Removing "+photo.name+", status: ");	
			Photo.findByIdAndRemove(photo.id,function(err){
				if (err) throw err;
				console.log("removed successfully");
			});
		}



	});

});
	

});
console.log("Clearing complete");
}