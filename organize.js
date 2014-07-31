var moment = require("moment"),
	_ = require("underscore"),
	fs = require("fs"),
	cwd = process.cwd(),
	config = null,
	args = {};

var organize = function(){

	return {

		args: {},

		go : function() {

			_.bindAll(this, 'parseArgs');

			if( process.argv.length > 2 ) {

				// Check params
				process.argv.forEach(this.parseArgs);

				console.log(this.args);

			} else {

				// Check for a config.json
				fs.exists(cwd + '/config.json', function(exists){
					if(exists) {
						config = require(cwd + '/config.json');
						console.log("config file parsed : " + JSON.stringify(config));
					} else {
						console.log('For Usage : See README.md');
					}
				});

			}

		},

		parseArgs : function(arg, index) {
			if(index > 1) {
				var stripDashes = arg.replace("--", "");
				this.args[stripDashes.split("=")[0]] = stripDashes.split("=")[1];
			}
		}

	};

};

organize().go();

// Get files to organize

// Start timer

// iterate files

	// move file

// done

// stop timer

console.log(moment().format("[Video]/YYYY/MM-MMMM"));