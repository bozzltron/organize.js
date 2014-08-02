var moment = require("moment"),
	_ = require("underscore"),
	fs = require("fs"),
	cwd = process.cwd(),
	path = require("path"),
	ExifImage = require('exif').ExifImage;
	Job = require("./job");

// organize.js
var organize = function(){

	return {

		args: {},

		report: {},

		go : function() {

			_.bindAll(this, 'parseArgs', 'parseConfig', 'jobDone');

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


			if(_.isArray(this.args)) {
				this.processed = 0;
				new Job(this.args[0], this.jobDone).start();
			} else {
				this.processJob(this.args);
				new Job(this.args, this.jobDone).start();
			}

		},

		parseArgs : function(arg, index) {

			if(index > 1) {
				var stripDashes = arg.replace("--", "");
				this.args[stripDashes.split("=")[0]] = stripDashes.split("=")[1];
			}

		},

		jobDone: function(job){
			this.processed++;
			console.log("Processed " + this.processed + " of " + this.args.length + " jobs.");
		}

	};

};

module.exports = organize;

// Unless this is a test environment, lets go!
if(process.env.mode != "TEST") {
	organize().go();
}


