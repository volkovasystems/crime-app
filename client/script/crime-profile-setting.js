Crime
	
	.factory( "getUserData", [
		"ProgressBar",
		"Event",
		"$http",
		"getUserServerData",
		function factory( ProgressBar, Event, $http, getUserServerData ){
			var getUserData = function getUserData( scope, callback ){
				var callback = callback || function callback( ){ };

				var rootCallback = callback;

				ProgressBar( scope );
				
				Event( scope );

				async.waterfall( [
					function initiateLoading( callback ){
						scope.startLoading( );

						callback( );
					},

					function getUserData( callback ){
						scope.publish( "get-user-account-data",
							function onGetUserAccountData( error, userAccountData ){
								callback( error, userAccountData );
							} );
					},

					function checkUserAccountData( userAccountData, callback ){
						if( _.isEmpty( userAccountData ) ){
							getUserData( scope, rootCallback );

							callback( "recurse" );

						}else{
							callback( null, userAccountData );
						}
					},

					function processUserData( userAccountData, callback ){
						var accessID = btoa( userAccountData.accessToken ).replace( /[^A-Za-z0-9]/g, "" );;

						callback( null, accessID );
					},

					function getUserData( accessID, callback ){
						var requestEndpoint = getUserServerData( ).joinPath( "api/:accessID/user/get" );

						requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

						$http.get( requestEndpoint )
							.success( function onSuccess( response, status ){
								if( response.status == "success" ){
									callback( null, response.data );

								}else{
									callback( response.status, response.data );
								}
							} )
							.error( function onError( response, status ){
								//: @todo: Do something on error.
								callback( new Error( "error getting user data" ) );
							} );
					}
				],
					function lastly( state, userData ){
						callback( state, userData );

						scope.finishLoading( );
					} );
			};

			return getUserData;
		}
	] )

	.directive( "profileSettingController", [
		"Event",
		"getUserData",
		function directive( Event, getUserData ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "dash-clicked:profile",
						function onNavigateProfile( ){
							scope.publish( "show-profile-setting" );
						} );

					scope.on( "close-profile-setting",
						function onCloseProfileSetting( ){
							scope.publish( "hide-profile-setting" );
						} );

					scope.on( "show-profile-setting",
						function onShowProfileSetting( ){
							getUserData( scope, 
								function onGetUserData( error, userData ){
									scope.publish( "set-profile-setting", userData );
								} );
						} );
				}
			}
		}
	] );