var moment = require("moment"),
	_ = require("underscore"),
	fs = require("fs"),
	cwd = process.cwd(),
	path = require("path"),
	ExifImage = require('exif').ExifImage;
	FileProcessor = require("./fileProcessor");

// job.js
var Job = function(job, callback){

	return {

		report: {
			success: 0,
			directory: 0,
			noext: 0,
			noexif: 0,
			copyfail:0,
			ext: {}
		},

		processedFiles: [],

		start: function() {

			_.bindAll(this, 'getFiles', 'fileDone', 'processFile', 'writeReport');

			console.log("processing job", job);
			this.job = job;
			this.callback = callback;
			this.job.files = [];
			this.processed = 0;
			this.directory = job.from;
			this.startTime = new Date().getTime();
			fs.readdir(this.directory, this.getFiles);

		},

		getFiles: function (err, files) {

			console.log("getFiles");
		    if (err) {
		        throw err;
		    }
	
		    this.files = files;
		    this.index = 0;
		    this.files.forEach(this.processFile);
		   
		},

		fileDone:function(report) {

			switch(report.status){
				case "directory":

					this.report.directory++;
					if(this.job.recursive) {	
						var job = _.clone(this.job);
						job.from = report.file;
						new Job(job, this.fileDone).start();
					}

				break;
				case "noext":
					this.report.noext++;
				break;
				case "noexif":
					this.report.noexif++;
				break;
				case "copyfail":
					this.report.copyfail++;
				break;
				case "success":

					// tally up how many files for each extension were processed
					if(!this.report.ext[report.ext]) {
						this.report.ext[report.ext] = 0;
					}
					this.report.ext[report.ext]++;

					this.processedFiles.push(report.file);

				break;
			}

			this.processed++;
			if(this.processed == this.files.length) {
				this.endTime = new Date().getTime();
				this.writeReport();
				this.callback(this.job);
			}

		},

		processFile: function(file) {
			new FileProcessor(file, this.directory, this.job, this.fileDone).start();
		},

		writeReport: function() {

		   var time = (this.endTime - this.startTime) / 1000;
           console.log("Processed " + this.files.length + " files in " + time + " seconds.");
           console.log("	Ignored " + this.report.noext + " files.");
		   console.log("	Found " + this.report.directory + " directories.");
		   console.log("	Found " + this.report.noexif + " files with no exif data.");
		   console.log("	" + this.report.copyfail + " failed to copy.");
           _.each(this.report.ext, function(num, ext){
               console.log("	Found " + num + " " + ext + " files.");
           });
           
           console.log(this.processedFiles);

       }

	};

};

module.exports = Job;



