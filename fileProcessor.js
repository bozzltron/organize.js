var moment = require("moment"),
	_ = require("underscore"),
	fs = require("fs"),
	cwd = process.cwd(),
	path = require("path"),
	ExifImage = require('exif').ExifImage;

// organize.js
var FileProcessor = function(file, directory, job, callback){

	return {

		start: function() {

			_.bindAll(this, 'checkForDirectory', 'getExif', 'calculateDesination');

			this.callback = callback;
			this.directory = directory;
			this.file = file;
			this.job = job;
			this.fullPath = this.directory + "/" + this.file;
			fs.stat(this.fullPath, this.checkForDirectory);

		},

		checkForDirectory: function(err, stat) {

			console.log("checkForDirectory");
		    if (err) {
		        throw(err);
		    }

		    // handle directory
			if(stat.isDirectory()) {

				console.log("handle directory");
				if(this.job.recursive) {	
					this.directory = this.fullPath;
					console.log("loading", this.directory);
					fs.readdir(this.directory, this.getFiles);
				}

				this.callback({status:"directory", file: this.file});

			} else {
							
				// handle file
				console.log("handle file", this.file);
				this.ext = path.extname(this.file).replace(".","");
				if( _.contains( this.job.types.split(','), this.ext ) ) {
					this.getExif();
				} else {
					this.callback({status:"noext", file:this.file});
				}


			}

			
		},

		getExif: function() {
			console.log("getExif");
			try {

			    new ExifImage({ image : this.fullPath }, this.calculateDesination);

			} catch (error) {
			    this.callback({status:"noexif", file:this.file});
			}

		},

		calculateDesination: function(error, image) {

			console.log("calculateDesination");
	        if (error) {
	            console.log('Error: ' + error.message);
	        }
	        else {

	        	if(image.exif.CreateDate) {
		        	console.log(image.exif.CreateDate);
	            	var destinationDirectory = moment(new Date(image.exif.CreateDate.split(" ")[0])).format(this.job.to);
	            	this.processedFile = {source: this.fullPath, destination: destinationDirectory + '/' + this.file};
	        	}
	        }
			   
			this.callback({status:"success", file:this.processedFile, ext:this.ext});
		}
	};

};

module.exports = FileProcessor;


