Crime
	.directive( "reportController", [
		"Event",
		"ProgressBar",
		"$http",
		"getReportServerData",
		function directive( 
			Event, 
			ProgressBar, 
			$http,
			getReportServerData
		){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					ProgressBar( scope );

					Event( scope );

					scope.on( "control-click:crime-report-cancel",
						function onReportCancel( ){
							scope.publish( "clear-report-data" );

							scope.publish( "hide-report" );
						} );

					scope.on( "control-click:crime-confirm-location",
						function onConfirmLocation( ){
							async.waterfall( [
								function initiateLoading( callback ){
									scope.startLoading( );

									callback( );
								},

								function getCurrentPosition( callback ){
									scope.publish( "get-current-position", 
										function delegateCallback( error, position ){
											callback( error, position );
										} );
								},

								function getMapZoom( position, callback ){
									scope.publish( "get-map-zoom", 
										function delegateCallback( error, zoom ){
											callback( error, position, zoom );
										} );
								},

								function getCurrentAddress( position, zoom, callback ){
									scope.publish( "get-current-address",
										function delegateCallback( error, address ){
											callback( error, position, zoom, address );
										} )
								},

								function showReport( position, zoom, address, callback ){
									scope.publish( "set-report-data", {
										"position": position,
										"zoom": zoom,
										"address": address
									}, function delegateCallback( ){
										scope.publish( "show-report" );
										
										callback( );
									} );
								}
							],
								function lastly( error ){
									scope.finishLoading( );
								} );
						} );

					scope.on( "control-click:crime-report-send",
						function onReportSend( ){
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

								function getUserProfileData( userAccountData, callback ){
									scope.publish( "get-basic-profile-data",
										function onGetBasicProfileData( error, userProfileData ){
											callback( error, userAccountData, userProfileData );
										} );
								},

								function processUserData( userAccountData, userProfileData, callback ){
									var userData = {
										"userID": userAccountData.userID,
										"profileName": userProfileData.profileName,
										"profileURL": userProfileData.profileURL,
										"profileImage": userProfileData.profileImage
									};

									var hashedValue = btoa( JSON.stringify( userData ) );
									userData.userID = hashedValue;

									var accessID = btoa( userAccountData.accessToken ).replace( /[^A-Za-z0-9]/g, "" );
									userData.accessID = accessID;

									callback( null, userData );
								},

								function getReportData( userData, callback ){
									scope.publish( "get-report-data",
										function delegateCallback( error, reportData ){
											callback( error, userData, reportData );
										} );
								},

								function applyServerFormat( userData, reportData, callback ){
									var hashedValue = btoa( JSON.stringify( reportData ) );

									var formattedReportData = {
										"reportID": 			hashedValue,
										"reporterID": 			userData.userID,
										"reporterState": 		"anonymous",
										"reportTimestamp": 		reportData.timestamp,
										"reportLocation": {
											"latitude": 		reportData.position.latitude,
											"longitude": 		reportData.position.longitude,
											"zoom": 			reportData.zoom
										},
										"reportMapImageURL": 	reportData.staticMapURL,
										"reportTitle": 			reportData.title,
										"reportDescription": 	reportData.description,
										"reportCaseType": 		reportData.category,
										"reportAddress": 		reportData.address
									};

									callback( null, userData, formattedReportData );
								},

								function sendReportData( userData, reportData, callback ){
									var requestEndpoint = getReportServerData( ).joinPath( "api/:accessID/report/add" );

									requestEndpoint = requestEndpoint.replace( ":accessID", userData.accessID );

									$http.post( requestEndpoint, reportData )
										.success( function onSuccess( response, status ){
											callback( response.status );
										} )
										.error( function onError( response, status ){
											//: @todo: Do something on error.
											callback( new Error( "error sending report data" ), response );
										} );
								}
							],
								function lastly( state, response ){
									if( state === "success" ){
										scope.publish( "report-added" );

									}else if( state instanceof Error ){
										scope.publish( "error", "report-error", state, response );
									}

									scope.finishLoading( );
								} );
						} );

					scope.on( "report-added",
						function onReportAdded( ){
							scope.publish( "clear-report-data" );

							scope.publish( "hide-report" );
						} );

					scope.on( "show-report",
						function onShowReport( ){
							scope.publish( "set-control-list",
								[
									{
										"reference": "crime-report",
										"name": "report-control-group",
										"controlList": [
											{
												"reference": "crime-report",
												"name": "crime-report-cancel",
												"title": "cancel",
												"icon": "ic_cancel_24px"
											},
											{
												"reference": "crime-report",
												"name": "crime-report-send",
												"title": "send",
												"icon": "ic_send_24px"
											}
										]
									}
								], true );
							
							scope.publish( "show-control" );
						} );

					scope.on( "hide-report",
						function onHideReport( ){
							scope.publish( "remove-control", "crime-report" );
						} );
				}
			}
		}
	] );