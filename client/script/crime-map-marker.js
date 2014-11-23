Crime
	
	.factory( "getAllCrimeNearReporter", [
		"$http",
		"getReportServerData",
		function factory( $http, getReportServerData ){
			var getAllCrimeNearReporter = function getAllCrimeNearReporter( scope ){
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

					function processRequestEndpoint( accessID, callback ){
						var requestEndpoint = getReportServerData( ).joinPath( "api/:accessID/report/get/all/near" );

						requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

						callback( null, requestEndpoint );
					},

					function getCurrentPosition( requestEndpoint, callback ){
						var position = scope.mapComponent.getCenter( );

						var latitude = position.lat( );
						var radianLatitude = math.unit( latitude, "deg" ).to( "rad" ).value;

						var longitude = position.lng( );
						var radianLongitude = math.unit( longitude, "deg" ).to( "rad" ).value;

						requestEndpoint = [ requestEndpoint, "?",
							[ "latitude", radianLatitude ].join( "=" ), "&",
							[ "longitude", radianLongitude ].join( "=" ) ].join( "" );

						callback( null, requestEndpoint );
					},

					function getReportListFromServer( requestEndpoint, callback ){
						$http.get( requestEndpoint )
							.success( function onSuccess( response, status ){
								if( response.status == "error" ){
									callback( response.data );

								}else if( response.status == "failed" ){
									callback( response.data );

								}else{
									callback( null, response.data );
								}
							} )
							.error( function onError( response, status ){
								//: @todo: Do something on error.
								callback( new Error( "error sending report data" ), response );
							} );
					},

					function createAllMapMarker( reportList, callback ){
						_.each( reportList,
							function onEachReportItem( reportData ){
								var iconData = {
									"sourceURL": "../library/svg-sprite-maps.svg",
									"iconName": "ic_place_24px"
								};

								scope.publish( "create-map-marker", reportData.reportLocation, iconData, scope.mapComponent );
							} );
						
						callback( );
					}
				],
					function lastly( error ){
						scope.finishLoading( );
					} );
			};

			return getAllCrimeNearReporter;
		}
	] )

	.directive( "mapMarkerController", [
		"Event",
		"getAllCrimeNearReporter",
		function directive( Event, getAllCrimeNearReporter ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "login-success",
						function onLoginSuccess( ){
							getAllCrimeNearReporter( scope );
						} );

					scope.on( "report-added",
						function onLoginSuccess( ){
							getAllCrimeNearReporter( scope );
						} );

					var self = this;
					scope.on( "map-position-changed",
						function onMapPositionChanged( position ){
							if( self.timeout ){
								clearTimeout( self.timeout );

								self.timeout = null;
							}

							self.timeout = setTimeout( function onTimeout( ){
								getAllCrimeNearReporter( scope );

								clearTimeout( self.timeout );

								self.timeout = null;
							}, 3000 );
						} );
				}
			}
		}
	] );