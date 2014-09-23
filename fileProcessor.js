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

		report: { 
			source : "",
			destination: "",
			status : "Success",
			scenario : "Copied",
			print : function(){
				console.log("===============");
				console.log(" SOURCE       :  " + this.source);
				console.log(" DESTINATION  :  " + this.destination);
				console.log(" STATUS       :  " + this.status);
				console.log(" SCENARIO     :  " + this.scenario);
				console.log("===============");
				console.log("");
			}
		},

		start: function() {

			_.bindAll(this, 'checkForDirectory', 'getExif', 'calculateDesination', 'stream', 'error', 'success', 'unlink');
			
			this.callback = callback;
			this.directory = directory;
			this.file = file;
			this.job = job;
			this.report.source = this.directory + "/" + this.file;
			fs.stat(this.report.source, this.checkForDirectory);

		},

		checkForDirectory: function(err, stat) {

		    if (err) {
		    	this.report.status = "Failed";
		    	this.report.scenario = "File Status : " + err;
		        this.callback({status:"statfail", file: this.report});
		    }

		    // handle directory
			if(stat.isDirectory()) {

				this.callback({status:"directory", file: this.report});

			} else {
							
				// handle file
				this.report.ext = path.extname(this.file).replace(".","").toLowerCase();
				if( _.contains( this.job.types.split(','), this.report.ext ) ) {
					this.getExif();
				} else {
					this.report.status = "Ignored";
					this.report.scenario = "This is not the type your're looking for.";
					this.callback({status:"noext", file: this.report});
				}

			}
			
		},

		getExif: function() {
			new ExifImage({ image : this.report.source }, this.calculateDesination);
		},

		calculateDesination: function(error, image) {
			
	        if (error) {
	            this.file.status = "Failed";
	            this.file.scenario = "Exif Error: " + error.message;
	            this.callback({status:"noexif", file:this.report});
	        }
	        else {

	        	if(image.exif.CreateDate) {
		        	var colons = /\:/gi;
		        	var date = new Date(image.exif.CreateDate.split(" ")[0].replace(colons,"-"));
	            	var destinationDirectory = moment(date).format(this.job.to);
	            	this.report.destination = destinationDirectory;
	            	
	            	if(this.job.dryrun) {  
						this.callback({status:"success", file:this.report});
					} else {
						this.copy();
					}
	        	} else {
		            this.file.status = "Failed";
		            this.file.scenario = "Date Error:  No exif.CreateDate value";
		            this.callback({status:"noexif", file:this.report});	        		
	        	}
	        }
			
		},

		copy: function () {
		
			if(this.report.source && this.report.destination) {
				mkdirp(this.report.destination, this.stream);
			} else {
				this.report.status = "Failed";
				this.report.scenario = "Copy Failed";
				this.callback({status:"copyfail", file:this.report});
			}

		},

		stream: function(err) {

			if (err) {
				this.report.status = "Failed";
				this.report.scenario = "Stream Error : " + err;
			}

			this.report.destination += "/" + this.file;
	
			var rd = fs.createReadStream(this.report.source);
			rd.on("error", this.error);

			var wr = fs.createWriteStream(this.report.destination);
			wr.on("error", this.error);

			wr.on("close", this.success);

			rd.pipe(wr);

		},

		error:function(err){
			this.report.status = "Failed";
			this.report.scenario = "Copy Failed : " + err;
			this.callback({status:"copyfail", file:this.report});
		},

		success: function(ex) {
			if(this.job.move) {
				fs.unlink(this.report.source, this.unlink);
			} else {
				this.callback({status:"success", file:this.report});
			}
		},

		unlink: function(err) {
			this.callback({status:"success", file:this.report});
		}

	};

};

module.exports = FileProcessor;


