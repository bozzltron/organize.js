var moment = require("moment"),
	fs = require("fs"),
	cwd = process.cwd(),
	config = null,
	args = {};

function parseArgs(arg) {
	var stripDashes = arg.replace("--", "");
	args[stripDashes.split("=")[0]] = stripDashes.split("=")[1];
}

if( process.argv.length > 2 ) {

	// Check params
	process.argv.forEach(function(val, index, array){
		console.log(val, index, array);
	});

} else {

	// Check for a config.json
	fs.exists(cwd + '/config.json', function(exists){
		if(exists) {
			config = require(cwd + '/config.json');
			console.log("config file parsed : " + JSON.stringify(config));
		} else {
			console.log('Usage : 1. node organize.js --from="import" --to="pictures/MM-MMMM" 2. Write a array of {to:"", from:""}  objects in a config.json.');
		}
	});

}



// Get files to organize

// Start timer

// iterate files

	// move file

// done

// stop timer

console.log(moment().format("[Video]/YYYY/MM-MMMM"));