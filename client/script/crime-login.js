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
		"Event",
		"$rootScope",
		"getFacebookAppID",
		function onRun( Event, $rootScope, getFacebookAppID ){
			Event( $rootScope );

			window.fbAsyncInit = function( ){
				FB.init( {
					"appId": getFacebookAppID( ),
					"xfbml": true,
					"cookie": true,
					"version": "v2.1"
				} );

				$rootScope.publish( "facebook-sdk-loaded" );
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

	.factory( "sendUserDataToServer", [
		"ProgressBar",
		"Event",
		"$http",
		"getUserServerData",
		function factory(
			ProgressBar,
			Event,
			$http,
			getUserServerData
		){
			var sendUserDataToServer = function sendUserDataToServer( scope, loginType ){
				ProgressBar( scope );

				Event( scope );

				async.waterfall( [
					function initiateLoading( callback ){
						scope.startLoading( );

						callback( );
					},

					function getUserAccountData( callback ){
						scope.publish( "get-user-account-data",
							function onGetUserAccountData( error, userAccountData ){
								callback( error, userAccountData );
							} );
					},

					function checkUserAccountData( userAccountData, callback ){
						if( _.isEmpty( userAccountData ) ){
							sendUserDataToServer( scope, loginType );

							callback( "recurse" );

						}else{
							callback( null, userAccountData );
						}
					},

					function getBasicProfileData( userAccountData, callback ){
						scope.publish( "get-basic-profile-data",
							function onGetBasicProfileData( error, profileData ){
								callback( error, userAccountData, profileData );
							} );
					},

					function applyServerFormat( userAccountData, profileData, callback ){
						var userData = {
							"userID": userAccountData.userID
						};

						_.extend( userData, profileData );

						var hashedValue = btoa( JSON.stringify( userData ) );

						var formattedUserData = {
							"userID": 				hashedValue,
							"userAccountID": 		userAccountData.userID,
							"userAccountType": 		loginType,
							"userAccountToken": 	userAccountData.accessToken,
							"userDisplayName": 		profileData.profileName,
							"userProfileLink": 		profileData.profileURL,
							"userProfileImageURL": 	profileData.profileImage
						};

						callback( null, formattedUserData );
					},

					function loginToTheServer( userData, callback ){
						var requestEndpoint = getUserServerData( ).joinPath( "user/login" );

						$http.post( requestEndpoint, userData )
							.success( function onSuccess( response, status ){
								if( response.data == "redirect-register" ){
									callback( null, userData );

								}else{
									callback( "login-success" );
								}
							} )
							.error( function onError( response, status ){
								//: @todo: Do something on error.
								callback( new Error( "error sending user data" ), status );
							} );
					},

					function registerToTheServer( userData, callback ){
						var requestEndpoint = getUserServerData( ).joinPath( "user/register" );

						$http.post( requestEndpoint, userData )
							.success( function onSuccess( response, status ){
								callback( null, status );
							} )
							.error( function onError( response, status ){
								//: @todo: Do something on error.
								callback( new Error( "error sending user data" ), status );
							} );
					}
				],
					function lastly( state ){
						if( state === "recurse" ){
							//: Do nothing?

						}else if( state === "login-success" ){
							scope.publish( "login-success" );

						}else if( state ){
							scope.publish( "login-error" );

						}else{
							scope.publish( "login-success" );
						}

						scope.finishLoading( );
					} );
			};

			return sendUserDataToServer;
		}
	] )

	.directive( "loginController", [
		"ProgressBar",
		"Event",
		"CRIME_LOGO_IMAGE_SOURCE",
		"sendUserDataToServer",
		function directive( 
			ProgressBar,
			Event, 
			CRIME_LOGO_IMAGE_SOURCE,
			sendUserDataToServer
		){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					ProgressBar( scope );

					Event( scope );

					scope.publish( "change-logo-image", CRIME_LOGO_IMAGE_SOURCE );

					//: Login user in the server. This is a second verification.
					//: If the user is not yet register, it will do a registration based on his third party account.
					scope.on( "logged-in",
						function onLoggedIn( loginType ){
							sendUserDataToServer( scope, loginType );
						} );

					scope.on( "proceed-default-app-flow",
						function onProceedDefaultAppFlow( ){
							scope.publish( "hide-login" );
						} );
				}
			}
		}
	] );