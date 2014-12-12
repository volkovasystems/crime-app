var bodyParser = require( "body-parser" );
var compression = require( "compression" );
var session = require( "express-session" );

exports.configureApp = function configureApp( app ){
	app.use( compression( ) );

	app.use( bodyParser.json( ) );
	
	app.use( session( { 
		"secret": "#3vtl+6gw)eew8vdonh(z86mvi)#cn4__isxqoy#(_svy2g2hy",
		"resave": true,
		"saveUninitialized": true
	} ) );

	require( "./cors.js" ).cors( app );
};