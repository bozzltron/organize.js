var moment = require("moment"),
	_ = require("underscore"),
	fs = require("fs"),
	cwd = process.cwd(),
	path = require("path"),
	ExifImage = require('exif').ExifImage;

// organize.js
var organize = function(){

	return {

		args: {},

		report: {},

		go : function() {

			_.bindAll(this, 'parseArgs', 'processJob', 'parseConfig', 'getFiles', 'processFile', 'checkForDirectory', 'calculateDesination');

			if( process.argv.length > 2 ) {

				// Check params
				process.argv.forEach(this.parseArgs);
				this.beginProcess();

			} else {
				console.log("check for config.json");
				// Check for a config.JSON
				fs.exists(cwd + '/config.json', this.parseConfig);
			}

		},

		parseConfig: function(exists){

			if(exists) {
				this.args = require(cwd + '/config.json');
				console.log("config file parsed");
				this.beginProcess();
			} else {
				console.log('For Usage : See README.md');
			}

		},

		beginProcess: function() {

			this.startTime = new Date().getTime();

			if(_.isArray(this.args)) {
				//this.args.forEach(this.processJob);
				this.processJob(this.args[0]);
			} else {
				this.processJob(this.args);
			}

		},

		parseArgs : function(arg, index) {

			if(index > 1) {
				var stripDashes = arg.replace("--", "");
				this.args[stripDashes.split("=")[0]] = stripDashes.split("=")[1];
			}

		},

		processJob: function(job, index) {

			console.log("processing job");
			this.job = job;
			this.job.files = [];
			this.processed = 0;
			this.directory = job.from;
			fs.readdir(this.directory, this.getFiles);

		},

		getFiles: function (err, files) {

			console.log("getFiles");
		    if (err) {
		        throw err;
		    }
		    
		    //files.forEach(this.processFile);
		    this.files = files;
		    this.index = 0;
		    this.processFile();
		   
		},

		processFile: function() {

			// handle directory
			console.log("process file");
			this.file = this.files[this.index];
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

			} else {
							
				// handle file
				console.log("handle file", this.file);
				console.log("its a file", this.fullPath, path.extname(this.file));
				var ext = path.extname(this.file).replace(".","");
				console.log("ext", ext);
				if( _.contains( this.job.types.split(','), ext ) ) {
					
					this.getExif();

				}

				// tally up how many files for each extension were processed
				if(!this.report[ext]) {
					this.report[ext] = 0;
				}

				this.report[ext]++;

			}

			this.processed++;

			// Write report or keep going ?
			if(this.processed == this.files.length) {
				this.writeReport();
			} else {
				this.index++;
				this.processFile();
			}

			
		},

		getExif: function() {
			console.log("getExif");
			try {

			    new ExifImage({ image : this.fullPath }, this.calculateDesination);

			} catch (error) {
			    console.log('Error: ' + error);
			}

		},

		calculateDesination: function(error, image) {

			console.log("calculateDesination");
	        if (error) {
	            console.log('Error: ' + error.message);
	        }
	        else {

		        console.log(image.exif.CreateDate);
	            var destinationDirectory = moment(new Date(image.exif.CreateDate.split(" ")[0])).format(this.job.to);
	            this.job.files.push({source: this.fullPath, destination: destinationDirectory + '/' + this.file});
	        }
			    
		},

		writeReport: function() {

			console.log("Files processed: " + this.job.files.length);
		    _.each(this.report, function(num, ext){
		    	console.log("Found " + num + " " + ext + " files");
		    });
		    console.log(this.job.files);
		    
		},

	};

};

module.exports = organize;

// Unless this is a test environment, lets go!
if(process.env.mode != "TEST") {
	organize().go();
}


