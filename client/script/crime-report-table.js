Crime
	.directive( "reportTableController", [		
		"ProgressBar",
		"Event",
		"$http",
		"getUserServerData",
		"getReportServerData",
		function directive( Event , ProgressBar , $http , getUserServerData , getReportServerData ){
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
									
									callback( null, requestEndpoint );
								},

								function getReportListFromServer( requestEndpoint, callback ){
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
										console.log(requestEndpoint);										
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
									
									_(reports)
									.map(function each ( report ) {
										reportList = reportList.concat(report.data);
										return report;
									} );
									scope.publish( "set-report-table-list" , reportList );
									scope.finishLoading( );
								}
							 );
						} );																			
				}
			}
		}
	] );