Crime

	.factory( "getAllCrimeNearReporter", [
		"$http",
		"getReportServerData",
		function factory( $http, getReportServerData ){
			var getAllCrimeNearReporter = function getAllCrimeNearReporter( scope, callback ){
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
								callback( new Error( "error sending report data" ) );
							} );
					}
				],
					function lastly( error, reportList ){
						callback( error, reportList );

						scope.finishLoading( );
					} );
			};

			return getAllCrimeNearReporter;
		}
	] )

	.factory( "mapAllCrimeNearReporter", [
		"getAllCrimeNearReporter",
		function factory( getAllCrimeNearReporter ){
			var mapAllCrimeNearReporter = function mapAllCrimeNearReporter( scope ){
				
				getAllCrimeNearReporter( scope,
					function onResult( error, reportList ){
						_.each( reportList,
							function onEachReportItem( reportData ){
								var iconData = {
									"markerID": reportData.reportID,
									"sourceURL": "../image/@reportCaseType-marker.png"
										.replace( "@reportCaseType", reportData.reportCaseType )
								};

								scope.publish( "create-map-marker", 
									reportData.reportLocation, 
									iconData, 
									scope.mapComponent );
							} );
					} );
			};

			return mapAllCrimeNearReporter;
		}
	] )

	.directive( "mapMarkerController", [
		"Event",
		"mapAllCrimeNearReporter",
		function directive( Event, mapAllCrimeNearReporter ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					var self = this;
					scope.on( "login-success",
						function onLoginSuccess( ){
							mapAllCrimeNearReporter( scope );

							scope.on( "map-position-changed",
								function onMapPositionChanged( position ){
									if( self.timeout ){
										clearTimeout( self.timeout );

										self.timeout = null;
									}

									self.timeout = setTimeout( function onTimeout( ){
										mapAllCrimeNearReporter( scope );

										clearTimeout( self.timeout );

										self.timeout = null;
									}, 3000 );
								} );
						} );

					scope.on( "report-added",
						function onLoginSuccess( ){
							mapAllCrimeNearReporter( scope );
						} );
				}
			}
		}
	] );