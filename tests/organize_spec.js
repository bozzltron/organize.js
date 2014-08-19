
var Organize = require("../organize"),
    fs = require("fs");

describe("organize.js", function() {
    var organize;

    beforeEach(function(){
        organize = Organize();
    });

    it("should parse arguments", function(){

        organize.parseArgs('--from=import', 2);
        organize.parseArgs('--to=Photos', 3);

        expect(organize.args).toEqual({recursive : true, move : false, dryrun : false, from:"import", to:"Photos"});
    });

    it("should override arguments", function(){

        organize.parseArgs('--from=import', 2);
        organize.parseArgs('--to=Photos', 3);
        organize.parseArgs('--dryrun=true', 4);

        expect(organize.args).toEqual({recursive : true, move : false, dryrun : true, from:"import", to:"Photos"});
    });

    it("should detect bad arguments", function(){

        try {
            organize.parseArgs('-from=import', 2);
        } catch(e) {
            expect(e.message).toEqual('Invalid argument(s) : Example --param="value".');
        } 

        try {
            organize.parseArgs('--fromimport', 2);
        } catch(e) {
            expect(e.message).toEqual('Invalid argument(s) : Example --param="value".');
        } 

    });

    it("should detect arguments", function() {

        // Save jasmine args
        var oldargs = process.argv;

        // Run test
        process.argv = ["node", "organize.js", '--from="/import"', '--to="pictures"', '--types="jpg"'];
        spyOn(organize, 'beginProcess');
        organize.go();
        expect(organize.beginProcess).toHaveBeenCalled();

        // Restore jasmine args
        process.argv = oldargs;

    });

    it("should fail if there are not arguments and no config file", function() {   

        // Save jasmine args
        var oldargs = process.argv;
        process.argv = [];

        try {
            organize.go();
        } catch(e) {
            expect(e.message).toEqual('No parameters and no config file were provided.');
        } 

        // Restore jasmine args
        process.argv = oldargs;

    }); 

    it("should parse an config file", function(){

        // Save jasmine args
        var oldargs = process.argv;
        process.argv = [];

        var json = {
            "from": "/Volumes/bozzldrive/Import",
            "types": "jpg,png,jpeg,gif",
            "to": "[/Volumes/bozzldrive/Pictures]/YYYY/MM/DD",
            "recursive": false,
            "move": false,
            "dryrun": true
        };

        fs.writeFileSync(process.cwd() + "/config.json", JSON.stringify(json));

        spyOn(organize, 'beginProcess');

        organize.parseConfig(true);

        expect(organize.beginProcess.baseObj.args).toEqual(json);

        fs.unlinkSync(process.cwd() + "/config.json");

        // Restore jasmine args
        process.argv = oldargs;

    });

});