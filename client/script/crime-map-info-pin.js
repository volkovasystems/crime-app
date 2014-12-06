Crime
	.factory( "attachAllMapInfoPin", [
		"Event",
		function factory( Event ){
			var attachAllMapInfoPin = function attachAllMapInfoPin( scope, reportList ){
				Event( scope );

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
			};

			return attachAllMapInfoPin;
		}
	] )

	.factory( "attachAllMapInfoPinNearReporter", [
		"getAllCrimeNearReporter",
		"attachAllMapInfoPin",
		function factory( 
			getAllCrimeNearReporter,
			attachAllMapInfoPin
		){
			var attachAllMapInfoPinNearReporter = function attachAllMapInfoPinNearReporter( scope ){
				getAllCrimeNearReporter( scope,
					function onResult( error, reportList ){
						if( error ){
							//: @todo: Notify error here.

						}else{
							attachAllMapInfoPin( scope, reportList );
						}
					} );
			};

			return attachAllMapInfoPinNearReporter;
		}
	] )

	.directive( "mapInfoPinController", [
		"Event",
		"attachAllMapInfoPinNearReporter",
		"attachAllMapInfoPin",
		function directive( 
			Event, 
			attachAllMapInfoPinNearReporter,
			attachAllMapInfoPin
		){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					var self = this;
					scope.on( "login-success",
						function onLoginSuccess( ){
							attachAllMapInfoPinNearReporter( scope );

							/*scope.on( "map-position-changed",
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
								} );*/
						} );

					scope.on( "report-added",
						function onLoginSuccess( ){
							attachAllMapInfoPinNearReporter( scope );
						} );

					scope.on( "map-all-filtered-report",
						function onMapAllFilteredReport( reportList ){
							attachAllMapInfoPin( scope, reportList );
						} );
				}
			}
		}
	] );