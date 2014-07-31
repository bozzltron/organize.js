
var Organize = require("../organize");
console.log(Organize());

describe("organize.js", function() {
    var organize;

    beforeEach(function(){
        organize = Organize();
    });

    afterEach(function(){
        
    });

    it("should parse arguments", function(){

        organize.parseArgs('--from=import', 2);
        organize.parseArgs('--to=Photos', 3);

        expect(organize.args).toEqual({from:"import", to:"Photos"});
    });


});