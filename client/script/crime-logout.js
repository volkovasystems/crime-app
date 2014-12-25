Crime
	
	.factory( "logoutUser", [
		"Event",
		"ProgressBar",
		"getUserServerData",
		"$http",
		function factory( 
			Event, 
			ProgressBar,
			getUserServerData,
			$http
		){
			var logoutUser = function logoutUser( scope ){
				Event( scope );

				ProgressBar( scope );

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

					function processUserData( userAccountData, callback ){
						var accessID = btoa( userAccountData.accessToken ).replace( /[^A-Za-z0-9]/g, "" );

						callback( null, accessID );
					},

					function logoutUserFromServer( accessID, callback ){
						var requestEndpoint = getUserServerData( ).joinPath( "api/:accessID/logout" );

						requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

						$http.post( requestEndpoint )
							.success( function onSuccess( response, status ){
								if( response.status == "failed" ){
									callback( null, false, response.data );

								}else{
									callback( null, true, null );
								}
							} )
							.error( function onError( response, status ){
								callback( null, false, new Error( "error logging out user" ) );
							} );
					},

					function logoutUserFromThirdPartyConnection( hasLoggedOut, stateData, callback ){
						if( !hasLoggedOut ){
							callback( stateData );

							return;
						}

						var logoutPath = "user/logout";
						if( window.mobile ){
							logoutPath = "user/logout/mobile";
						}

						var requestEndpoint = getUserServerData( ).joinPath( logoutPath );

						if( window.mobile ){
							var redirectWindow = window.open( requestEndpoint , "_blank", "location=no" );
				
							redirectWindow.addEventListener( "loadstop",
								function onLoadStop( event ){
									if( event.code || URI( event.url ).hasQuery( "error" ) ){
										redirectWindow.close( );

										document.location.reload( true );

									}else if( URI( event.url ).hasQuery( "logged-out" ) ){
										redirectWindow.close( );

										document.location.reload( true );

									}else{
										//: @todo: Should we place a timeout here?
									}
								} );

						}else{
							window.location = requestEndpoint;	
						}
					}
				],
					function lastly( state ){
						//: @todo: Do something on the state data.

						scope.finishLoading( );
					} );
			};

			return logoutUser;
		}
	] )

	.directive( "logoutController", [
		"Event",
		"logoutUser",
		function directive( Event, logoutUser ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attribute ){
					Event( scope );

					scope.on( "dash-clicked:logout",
						function onNavigateLogout( ){
							scope.publish( "logout" );
						} );

					scope.on( "initiate-logout-procedure",
						function onInitiateLogoutProcedure( ){
							logoutUser( scope );
						} );
				}
			}
		}
	] );