var packageData = JSON.parse( require( "fs" ).readFileSync( "./package.json", "utf-8" ) );
exports.packageData = packageData;