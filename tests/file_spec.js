var Job = require("../fileProcessor.js"),
    fs = require("fs"),
    ExifImage = require('exif').ExifImage;

describe("fileProcessor.js", function() {

    var directory = process.cwd() + '/images';
    var job = {
        "from": process.cwd() + "/images",
        "types": "jpg,png,jpeg,gif",
        "to": "[" + process.cwd() + "/jobtest]",
        "recursive": false,
        "copy": true,
        "dryrun": false
    };

    it("should detect a copy a file", function(done){

    	var file = new FileProcessor("test.jpg", directory, job, function(){

            var filePath = directory + "/../jobtest/test.jpg";
            fs.exists(filePath, function(exists){
                console.log("exists");
                expect(exists).toEqual(true);
                done();
            });

        });

        file.start();

    });

    it("should persist exif in the copied file", function(done){

        new ExifImage({ image : directory + "/test.jpg" }, function(err, sourceImage){

            if(err) {
                console.log(err);
                done();
            }

            new ExifImage({ image : process.cwd() + "/jobtest/test.jpg" }, function(err2, destinationImage){
         
                if(err2) {
                    console.log(err2);
                    done();
                }

                expect(sourceImage.exif.CreateDate).toBe(destinationImage.exif.CreateDate);

                done();

            });

        });

    });

});