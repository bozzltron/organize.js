var moment = require("moment"),
	_ = require("underscore"),
	fs = require("fs"),
	cwd = process.cwd(),
	path = require("path"),
	ExifImage = require('exif').ExifImage,
	mkdirp = require('mkdirp');

// organize.js
var FileProcessor = function(file, directory, job, callback){

	return {

		start: function() {

			_.bindAll(this, 'checkForDirectory', 'getExif', 'calculateDesination', 'stream', 'error', 'success');

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
				this.callback({status:"directory", file: this.fullPath});

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
		
			new ExifImage({ image : this.fullPath }, this.calculateDesination);

		},

		calculateDesination: function(error, image) {

			console.log("calculateDesination");
	        if (error) {
	            console.log('Error: ' + error.message);
	            this.callback({status:"noexif", file:this.file});
	        }
	        else {

	        	if(image.exif.CreateDate) {
		        	var colons = /\:/gi;
		        	console.log(image.exif.CreateDate.split(" ")[0].replace(colons,"-"));
		        	var date = new Date(image.exif.CreateDate.split(" ")[0].replace(colons,"-"));
		        	console.log(date);
		        	console.log("moment format", moment(date).format(this.job.to));
	            	var destinationDirectory = moment(date).format(this.job.to);
	            	this.processedFile = {source: this.fullPath, destination: destinationDirectory};

	            	if(this.job.dryrun) {  
						this.callback({status:"success", file:this.processedFile, ext:this.ext});
					} else {
						this.copy(this.processedFile.source, this.processedFile.destination);
					}
	        	}
	        }
			
		},

		copy: function (source, target) {
			console.log("copy things");
		
			if(source && target) {
				console.log("making " + this.destination);
				mkdirp(this.processedFile.destination, this.stream);
			} else {
				console.log("copyfail", source, target);
				this.callback({status:"copyfail", file:this.file});
			}

		},

		stream: function(err) {
			console.log("stream");
			if (err) console.error(err);

			var source = this.processedFile.source;
			var target = this.processedFile.destination + "/" + this.file;
			var rd = fs.createReadStream(source);
			rd.on("error", this.error);

			var wr = fs.createWriteStream(target);
			wr.on("error", this.error);

			wr.on("close", this.success);

			rd.pipe(wr);

		},

		error:function(err){
			console.log(err);
			this.callback({status:"copyfail", file:this.file});
		},

		success: function(ex) {
			this.callback({status:"success", file:this.file});
		}

	};

};

module.exports = FileProcessor;


