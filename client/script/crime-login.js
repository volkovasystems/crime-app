Crime
	.factory( "getFacebookAppID", [
		function factory( ){
			return function getFacebookAppID( ){
				if( window.production ){
					//: This is the production app in Facebook.
					return "1536844313229530";
				
				}else{
					//: This is the development app in Facebook.
					return "725798337493212";
				}
			};
		}
	] )
	
	.run( [
		"getFacebookAppID",
		function onRun( getFacebookAppID ){
			window.fbAsyncInit = function( ){
				FB.init( {
					"appId": getFacebookAppID( ),
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
		}
	] )

	.directive( "loginController", [
		"Event",
		"CRIME_LOGO_IMAGE_SOURCE",
		function directive( Event, CRIME_LOGO_IMAGE_SOURCE ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.publish( "change-logo-image", CRIME_LOGO_IMAGE_SOURCE );

					scope.on( "proceed-default-app-flow",
						function onProceedDefaultAppFlow( ){
							scope.publish( "hide-login" );
							
							//: @todo: Send the data to the server.
						} );
				}
			}
		}
	] );