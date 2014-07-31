var moment = require("moment"),
	_ = require("underscore"),
	fs = require("fs"),
	cwd = process.cwd(),
	path = require("path");

// organize.js
var organize = function(){

	return {

		args: {},

		go : function() {

			_.bindAll(this, 'parseArgs', 'processJob', 'parseConfig', 'getFiles', 'processFile');

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
				console.log("config file parsed : " + JSON.stringify(this.args));
				this.beginProcess();
			} else {
				console.log('For Usage : See README.md');
			}

		},

		beginProcess: function() {

			this.startTime = new Date().getTime();

			if(_.isArray(this.args)) {
				this.args.forEach(this.processJob);
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

		processJob: function(job) {

			this.job = job;
			console.log("processing job", job);
			fs.readdir(job.from, this.getFiles);
		},

		getFiles: function (err, files) {

		    if (err) {
		        throw err;
		    }
		    this.job.files = [];
		    files.forEach(this.processFile);
		    console.log("Files processed: " + this.job.files.length);
		    
		},

		processFile: function(file) {

			var ext = path.extname(file).replace(".","");
			if( _.contains( this.job.types.split(','), ext ) ) {
				this.job.files.push(file);
			}

		}

	};

};

module.exports = organize;

// Unless this is a test environment, lets go!
if(process.env.mode != "TEST") {
	organize().go();
}


