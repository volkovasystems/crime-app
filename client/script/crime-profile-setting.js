Crime

	.factory( "updateUserData", [
		"ProgressBar",
		"Event",
		"$http",
		"getUserServerData",
		function factory( ProgressBar, Event, $http, getUserServerData ){
			var updateUserData = function updateUserData( scope, callback ){
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
							updateUserData( scope, rootCallback );

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

					function processUserData( userAccountData, userProfileData, callback ){
						var userData = [
							[ "userID", 		userAccountData.userID ],
							[ "profileName", 	userProfileData.profileName ],
							[ "profileURL", 	userProfileData.cleanProfileURL ],
							[ "profileImage", 	userProfileData.cleanProfileImage ]
						];

						var hashedValue = btoa( JSON.stringify( userData ) ).replace( /[^A-Za-z0-9]/g, "" );
						userData.userID = hashedValue;

						var accessID = btoa( userAccountData.accessToken ).replace( /[^A-Za-z0-9]/g, "" );
						userData.accessID = accessID;

						callback( null, userData );
					},

					function getProfileSetting( userData, callback ){
						scope.publish( "get-profile-setting",
							function onGetProfileSetting( error, profileSetting ){
								var userSettingData = {
									"userID": userData.userID,
									"userEMail": profileSetting.userEMail,
									"userDisplayName": profileSetting.displayName
								};

								callback( null, userData, userSettingData );
							} );
					},

					function updateUserData( userData, userSettingData, callback ){
						var requestEndpoint = getUserServerData( ).joinPath( "api/:accessID/user/update" );

						requestEndpoint = requestEndpoint.replace( ":accessID", userData.accessID );

						$http.post( requestEndpoint, userSettingData )
							.success( function onSuccess( response, status ){
								if( response.status == "success" ){
									scope.publish( "notify", labelData.USER_UPDATE_SUCCESS_PROMPT, "success" );

									callback( );

								}else{
									scope.publish( "notify", labelData.USER_UPDATE_FAILED_PROMPT, "warn" );

									callback( response.status );
								}
							} )
							.error( function onError( response, status ){
								scope.publish( "notify", labelData.USER_UPDATE_ERROR_PROMPT, "error" );

								callback( new Error( "error getting user data" ) );
							} );
					}
				],
					function lastly( state, userData ){
						callback( state );

						scope.finishLoading( );
					} );
			};

			return updateUserData;
		}
	] )

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
									scope.publish( "notify", labelData.USER_GET_FAILED_PROMPT, "warn" );

									callback( response.status, response.data );
								}
							} )
							.error( function onError( response, status ){
								scope.publish( "notify", labelData.USER_GET_ERROR_PROMPT, "error" );

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
		"updateUserData",
		function directive( Event, getUserData, updateUserData ){
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
									if( error ){

									}else{
										scope.publish( "set-profile-setting", userData );	
									}
								} );
						} );

					scope.on( "update-profile-data",
						function onShowProfileSetting( ){
							scope.publish( "close-profile-setting" );

							updateUserData( scope, 
								function onUpdateUserData( error ){
									if( error ){

									}else{
										scope.publish( "user-data-updated" );	
									}
								} );
						} );
				}
			}
		}
	] );