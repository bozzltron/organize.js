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

		args: {
			recursive: true,
			move: false,
			dryrun: false
		},

		report: {},

		go : function() {

			_.bindAll(this, 'parseArgs', 'parseConfig', 'jobDone');

			if( process.argv.length > 2 ) {

				// Check params
				process.argv.forEach(this.parseArgs);
				this.beginProcess();

			} else {

				// Check for a config.JSON
				fs.exists(cwd + '/config.json', this.parseConfig);

			}

		},

		parseConfig: function(exists){

			if(exists) {

				this.args = _.extend(this.args, require(cwd + '/config.json'));
				this.beginProcess();

			} else {

				throw Error("No parameters and no config file were provided.");

			}

		},

		beginProcess: function() {

			if(_.isArray(this.args)) {

				this.processed = 0;
				new Job(this.args[0], this.jobDone).start();

			} else {

				new Job(this.args, this.jobDone).start();

			}

		},

		parseArgs : function(arg, index) {

			if(index > 1) {
				if(arg.indexOf("=") == -1 || arg.indexOf("--") == -1) {
					throw Error('Invalid argument(s) : Example --param="value".');
				}
				var stripDashes = arg.replace("--", "");
				if(stripDashes.split("=")[1] == "true") {
					this.args[stripDashes.split("=")[0]] = true;
				} else if (stripDashes.split("=")[1] == "false") {
					this.args[stripDashes.split("=")[0]] = false;
				} else {
					this.args[stripDashes.split("=")[0]] = stripDashes.split("=")[1];
				}

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


