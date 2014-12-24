Crime

	.factory( "mobileLogin", [
		"getUserServerData",
		function factory( getUserServerData ){
			var mobileLogin = function mobileLogin( callback ){
				callback = callback || function callback( ){ };

				var requestEndpoint = getUserServerData( ).joinPath( "user/login/mobile" );

				var redirectWindow = window.open( requestEndpoint , "_blank", "location=no" );
				
				redirectWindow.addEventListener( "loadstop",
					function onLoadStop( event ){
						/*:
							Check the content of event here I assume that
								this will be called several times.

							My assumptions are these,
							1. Since we are using in app browser the same reference
								to window may be retained even if we redirect it to facebook
								and going back.

							2. Due to assumption #1 loadstop event must be called thrice.
								First is when login.html was rendered.
								Second is when facebook login is rendered.
								Third is when facebook redirects back to login.html

							event.url may contain information regarding this.

							Assumption #1 and #2 will happen only when the user is not really logged in
								at the very first of the app. It means either any local storage
								or cookie set by facebook is not yet set.

							Alternatively, we provided inside login.html a check if the user already logs in.

							This resolves the issue of what should we do if facebook redirects back to login.html.

							Lastly, if facebook is already logged in we will redirect it to this url
								/login.html?logged-in=true

							Then using this listener we will listen to that url in event.url
								hopefully the original window reference was not destroyed.

							When we encounter that url we will close this window

							Proceed to checking if the user already logged in here.
						*/
						if( event.code || URI( event.url ).hasQuery( "error" ) ){
							//: @todo: Do something because we have an error.
							callback( new Error( "error encountered during login" ), false );

						}else if( URI( event.url ).hasQuery( "logged-in" ) ){
							callback( null, true, URI.parseQuery( URI( event.url ).query( ) ) );

							redirectWindow.close( );

						}else{
							//: @todo: Should we place a timeout here?
						}
					} );
			};

			return mobileLogin;
		}
	] )

	.factory( "getFacebookAppID", [
		"Event",
		"$rootScope",
		function factory( Event, $rootScope ){
			Event( $rootScope );

			var getFacebookAppID =  function getFacebookAppID( ){
				if( window.production ){
					return staticData.PRODUCTION_FACEBOOK_APPLICATION_ID;
					
					//: This is the production test app in Facebook.
					//return "725798337493212";
				
				}else{
					return staticData.DEVELOPMENT_FACEBOOK_APPLICATION_ID;
				}
			};

			$rootScope.subscribe( "get-facebook-app-id",
				function onGetFacebookAppID( callback ){
					callback( null, getFacebookAppID( ) );
				} );

			return getFacebookAppID;
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
							function onGetBasicProfileData( error, userProfileData ){
								var profileURL = new URI( userProfileData.profileURL );
								profileURL = userProfileData.profileURL.replace( profileURL.search( ), "" );
								userProfileData.cleanProfileURL = profileURL;

								var profileImage = new URI( userProfileData.profileImage );
								profileImage = userProfileData.profileImage.replace( profileImage.search( ), "" );
								userProfileData.cleanProfileImage = profileImage.split( "/" ).reverse( )[ 0 ];

								callback( error, userAccountData, userProfileData );
							} );
					},

					function applyServerFormat( userAccountData, userProfileData, callback ){
						var userData = [
							[ "userID", 		userAccountData.userID ],
							[ "profileName", 	userProfileData.profileName ],
							[ "profileURL", 	userProfileData.cleanProfileURL ],
							[ "profileImage", 	userProfileData.cleanProfileImage ]
						];

						var hashedValue = btoa( JSON.stringify( userData ) ).replace( /[^A-Za-z0-9]/g, "" );

						var formattedUserData = {
							"userID": 					hashedValue,
							"userAccountID": 			userAccountData.userID,
							"userAccountType": 			loginType,
							"userAccountToken": 		userAccountData.accessToken,
							"userAccountEMail": 		userProfileData.profileEMail,
							"userProfileName": 			userProfileData.profileName,
							"userProfileLink": 			userProfileData.profileURL,
							"userProfileImageURL": 		userProfileData.profileImage,
							"userCreationTimestamp": 	Date.now( )
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
		"mobileLogin",
		function directive( 
			ProgressBar,
			Event, 
			CRIME_LOGO_IMAGE_SOURCE,
			sendUserDataToServer,
			mobileLogin
		){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					ProgressBar( scope );

					Event( scope );

					scope.on( "show-login",
						function onShowLogin( ){
							scope.broadcast( "change-logo-image", CRIME_LOGO_IMAGE_SOURCE );
						} );

					//: Login user in the server. This is a second verification.
					//: If the user is not yet register, it will do a registration based on his third party account.
					scope.on( "logged-in",
						function onLoggedIn( loginType ){
							sendUserDataToServer( scope, loginType );
						} );

					scope.on( "logged-in",
						function onLoggedIn( loginType ){
							scope.publish( "hide-login" );

							scope.publish( "get-user-account-data",
								function onGetUserAccountData( error, userAccountData ){
									scope.publish( "proceed-default-app-flow", {
										"loginType": loginType,
										"userID": userAccountData.userID,
										"accessToken": userAccountData.accessToken
									} );
								} );
						} );

					scope.on( "proceed-default-app-flow",
						function onProceedDefaultAppFlow( ){
							scope.publish( "hide-login" );
						} );

					scope.on( "mobile-login",
						function onMobileLogin( callback ){
							mobileLogin( callback );
						} );
				}
			}
		}
	] );