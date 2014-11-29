Crime
	.factory( "attachAllMapInfoPin", [
		"getAllCrimeNearReporter",
		function factory( getAllCrimeNearReporter ){
			var attachAllMapInfoPin = function attachAllMapInfoPin( scope ){
				getAllCrimeNearReporter( scope,
					function onResult( error, reportList ){
						_.each( reportList,
							function onEachReportItem( reportData ){
								var mapInfoData = {
									"mapInfoID": reportData.reportID,
									"reportData": reportData
								};

								scope.publish( "create-map-info-pin", 
									reportData.reportLocation, 
									mapInfoData, 
									scope.mapComponent );
							} );
					} );
			};

			return attachAllMapInfoPin;
		}
	] )

	.directive( "mapInfoPinController", [
		"Event",
		"attachAllMapInfoPin",
		function directive( Event, attachAllMapInfoPin ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					var self = this;
					scope.on( "login-success",
						function onLoginSuccess( ){
							attachAllMapInfoPin( scope );

							scope.on( "map-position-changed",
								function onMapPositionChanged( position ){
									if( self.timeout ){
										clearTimeout( self.timeout );

										self.timeout = null;
									}

									self.timeout = setTimeout( function onTimeout( ){
										attachAllMapInfoPin( scope );

										clearTimeout( self.timeout );

										self.timeout = null;
									}, 3000 );
								} );
						} );

					scope.on( "report-added",
						function onLoginSuccess( ){
							attachAllMapInfoPin( scope );
						} );
				}
			}
		}
	] );