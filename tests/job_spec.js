var Job = require("../job.js"),
    fs = require("fs");

describe("job.js", function() {

    var config = {
        "from": process.cwd() + "/images",
        "types": "jpg,png,jpeg,gif",
        "to": "[" + process.cwd() + "/jobtest]",
        "recursive": false,
        "copy": false,
        "dryrun": false
    };

    it("should get files in a directory", function(done){

    	var job = new Job(config, function(){
        	console.log("done");
        });

        job.getFiles = function(err, files){
            expect(files).toEqual([ 'dir', 'test copy.jpg', 'test.jpg' ]);
            done();
        };

        job.start();	

    });

    it("should process files", function(done){

        var job = new Job(config, function(){
            console.log("done");
        });

        var count = 0;

        job.processFile = function(file){
            
            count++;
            if(count == 2) {
                done();
            }
            
        };

        job.start();

    });

});