var photos = [];
var pathJoin = require('path');
var fs = require('fs');
var Photo = require('../models/Photos');
var cleaner = require('../removeBadFiles');


photos.push({
	name: 'Node.js Logo',
	path: 'https://nodejs.org/images/logos/nodejs-green.png'
});

photos.push({
	name:'JS Logo',
	path:'http://javascript.tutorialhorizon.com/files/2015/07/javascript.png'
});

exports.list = function(req,res,next){
  cleaner.clear();
	Photo.find({}, function(err,photos){
		if(err) return next(err);
		res.render('photos',{
			title: 'Photos',
			photos: photos
		});
	});
};

exports.form = function(req,res){
	res.render('photos/upload',{
		title:'Photo upload'
	});
};

exports.submit = function(dir){
  return function(req,res,next){
  		var fstream;
  		var intial_name,final_name;
  		req.pipe(req.busboy);
  		req.busboy.on('file', function(fieldname,file,filename){
  			intial_name = filename;
  			console.log(fieldname);
  			fstream = fs.createWriteStream(dir+'/'+filename);
  			file.pipe(fstream);
  			fstream.on('close', function(){
  				console.log(filename+"upload complete");
  				fs.rename(dir+'/'+intial_name,dir+'/'+final_name,function(){
  				console.log("Name changed to: "+final_name);
  			});
  			});
  		});

  		req.busboy.on('field',function(key,value){
  			console.log("Key value: "+ key);
  			console.log("Field Value: "+value);
  			final_name = value;
  			
  		});

  		req.busboy.on('finish',function(){
  			
  			

  			Photo.create({
  				name: final_name,
  				path: final_name
  			}, function(err){
  				if (err) return next(err);
  				res.redirect('/');
  			});
  		});
  	}
  }

exports.download = function(dir){
    return function(req,res,next){
      console.log("recieved directory");
      var id = req.params.id;
      console.log("Id of the pic: " + id);
      Photo.findById(id,function(err,photo){
        if (err) return next(err);
        var path = pathJoin.join(dir,photo.path);
        console.log("trying to fetch file from: " + path);
        res.sendFile(path);
      });
    }
  }