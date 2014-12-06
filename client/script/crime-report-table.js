Crime
	.directive( "reportTableController", [		
		"ProgressBar",
		"Event",
		"$http",
		"getUserServerData",
		"getReportServerData",
		"getAppServerData",
		function directive( Event , ProgressBar , $http , getUserServerData , getReportServerData , getAppServerData ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					ProgressBar( scope );
					Event( scope );

					scope.on( "dash-clicked:report-table",
						function onNavigateProfile( ){
							scope.publish( "show-report-table" );
							scope.publish( "hide-control" );

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

									callback( null , accessID );
								},

								function processRequestEndpoint( accessID, callback ){									
									var requestEndpoint = getUserServerData( ).joinPath( "api/:accessID/user/get/all" );

									requestEndpoint = requestEndpoint.replace( ":accessID", accessID );
									
									callback( null, requestEndpoint , accessID );
								},

								function getReportListFromServer( requestEndpoint, adminAccessID, callback ){
									$http.get( requestEndpoint )
										.success( function onSuccess( response, status ){
											if( response.status == "failed" ){
												callback( response.data );

											}else{
												callback( null, response.data );
											}
										} )
										.error( function onError( response, status ){
											//: @todo: Do something on error.
											callback( new Error( "error sending report data" ), response );
										} );
								}
							 ],
								function lastly ( err , users )	{
									scope.publish( "set-all-user" , users );
									scope.finishLoading( );
								}
							 );
						} );

					scope.on( "set-all-user", 
						function allUser ( users ) {
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

									callback( null , accessID );
								},

								function processRequestEndpoint( adminAccessID, callback ){
									
									var requestEndpoint = getReportServerData().joinPath("api/:accessID/report/get/all");

									var userRequests = _(users)
									.map(function each ( user ) {
										return requestEndpoint.replace(":accessID" , user.accessID);
									} )
									.map(function each ( requestEndpoint ) { 																			
										return function ( callback ) {
											$http.get(requestEndpoint , {
												headers: {
													"Administrator-Access-ID": adminAccessID
												}
											} )
												.success( function onSuccess( response, status ){
													if( response.status == "failed" ){
														callback( null, response );

													}else{
														callback( null, response );
													}
												} )
												.error( function onError( response, status ){
													//: @todo: Do something on error.
													callback( null, response );
												} );
										}
									} )
									.value();
									
									callback( null, userRequests );
								},

								function getReportListFromServer( userRequests, callback ){
									async
									.parallel(userRequests,
										function lastly ( error , responseList  ) {
											callback( error, responseList )
										} );
								}
							 ],
								function lastly ( err , reports )	{
									var reportList = [];
									
									for (var index = 0 , len = reports.length ; index < len ; index ++) {
										reports[index].data
											.map( function each ( data ) {
												data.accessID = users[index].accessID;
												return data;
											} );
										reportList = reportList.concat(reports[index].data);
									}
									console.log(reportList);
									scope.publish( "set-report-table-list" , reportList );
									scope.finishLoading( );
								}
							 );
						} );

					scope.on( "update-report-data", 
						function onUpdate ( report ) {
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

									callback( null , accessID );
								},

								function processRequestEndpoint( adminAccessID, callback ){									
									var requestEndpoint = getReportServerData( ).joinPath( "api/:accessID/report/:reportID/update" );
									var appRequestEndPoint = getAppServerData( ).joinPath( "api/:accessID/report/:state" );

									console.log(report);									

									requestEndpoint = requestEndpoint.replace( ":accessID", report.accessID );
									requestEndpoint = requestEndpoint.replace( ":reportID", report.reportID );
									appRequestEndPoint = appRequestEndPoint.replace( ":accessID" , report.accessID );

									if ( report.reportState == "approved" ) {
										appRequestEndPoint = appRequestEndPoint.replace( ":state" , "approve" );
									}else if ( report.reportState == "rejected" ) {
										appRequestEndPoint = appRequestEndPoint.replace( ":state" , "reject" );
									}
									console.log(appRequestEndPoint);
									
									callback( null, requestEndpoint, appRequestEndPoint, adminAccessID );
								},

								function updateReportFormat ( requestEndpoint , appRequestEndPoint, adminAccessID , callback ) {
									report.adminAccessID = adminAccessID;
									callback ( null , [
											function ( callback ) {
												$http.post( requestEndpoint , report ) 
												.success ( function onSuccess ( response ) {
													callback ( null , response );
												} )
												.error( function onError ( response ) {
													callback ( null , response );
												} );
											},
											function ( callback ) {
												$http.post( appRequestEndPoint , 
														{
															"reportID": report.reportID,
															"reporterID": report.reporterID,
															"adminAccessID": adminAccessID
														} 
													) 
													.success ( function onSuccess ( response ) {
														callback ( null , response )
													} )
													.error( function onError ( response ) {
														callback ( null , response );
													} );
											}
										] );
								},

								function updateReportData ( requests , callback ) {									
									async
									.parallel(requests,
										function lastly ( error , responseList  ) {
											callback( error, responseList )
										} );
								}

							],
								function lastly ( err , response )	{
									console.log( response );
									scope.finishLoading( );
								}
							 );
						} )	;																		
				}
			}
		}
	] );