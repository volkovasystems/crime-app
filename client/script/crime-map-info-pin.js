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

						scope.on( "get-pinned-report-reference",
							function onGetPinnedReportReference( cleanReportID, callback ){
								if( cleanReportID == reportData.reportID.replace( /[^A-Za-z0-9]/g, "" ) ){
									var reportReferenceTitle = reportData.reportTitle
										.trim( )
										.replace( /[^a-zA-Z0-9\s]+/g, "" )
										.replace( /\s+/g, "-" );

									var reportReferenceID = btoa( [
											reportData.reportTimestamp,
											reportReferenceTitle
										].join( ":" ) )
										.substring( 0, 10 );

									var reportReference = [
										reportReferenceTitle,
										reportReferenceID
									].join( "-" );			
										
									callback( null, reportReference );
								}
							} );
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

					scope.on( "refresh-map",
						function onRefreshMap( ){
							attachAllMapInfoPinNearReporter( scope );
						} );

					scope.on( "close-report-pin",
						function onCloseReportPin( stopFlag, reportPinID ){
							if( stopFlag ){
								scope.publish( "clear-report-sharing-data", reportPinID );
							}
						} );

					scope.on( "open-report-pin",
						function onOpenReportPin( stopFlag, reportPinID ){
							if( stopFlag ){
								var timeout = setTimeout( function onTimeout( ){
									scope.publish( "initiate-report-sharing", reportPinID, true );

									clearTimeout( timeout );
								}, 100 );
							}
						} );
				}
			}
		}
	] );