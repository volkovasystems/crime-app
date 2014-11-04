window.fbAsyncInit = function( ){
	var appID = "725798337493212";
	
	if( window.production ){
		appID = "1536844313229530";
	}

	FB.init( {
		"appId": appID,
		"xfbml": true,
		"cookie": true,
		"version": "v2.1"
	} );
};

( function( d, s, id ){
	var js, fjs = d.getElementsByTagName( s )[ 0 ];
	
	if( d.getElementById( id ) ){ return; }
	
	js = d.createElement( s ); js.id = id;
	
	js.src = "https://connect.facebook.net/en_US/sdk.js";
	
	fjs.parentNode.insertBefore( js, fjs );

}( document, "script", "facebook-jssdk" ) );