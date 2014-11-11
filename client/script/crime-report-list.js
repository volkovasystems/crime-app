Crime
	.directive( "reportListController", [
		"ProgressBar",
		"Event",
		"$http",
		"getReportServerData",
		function directive(
			ProgressBar,
			Event,
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

					/*:
						Under normal flow starting from logged in state
							the user can already see his list of reports.

						If the server returned nothing then it means this is
							his first time to use the app.

							The report list will not be shown.
					*/
					scope.on( "logged-in",
						function onLoggedIn( loginType ){
							async.waterfall( [
								function initiateLoading( callback ){
									scope.startLoading( );

									callback( );
								},

								function getUserAccountData( callback ){
									scope.publish( "get-user-account-data",
										function onGetUserAccountData( error, userAccountData ){
											callback( error, userAccountData );
										} );
								},

								function processAccessID( userAccountData, callback ){
									var accessID = btoa( userAccountData.accessToken ).replace( /[^A-Za-z0-9]/g, "" );

									callback( null, accessID );
								},

								function processRequestEndpoint( accessID, callback ){
									var requestEndpoint = getReportServerData( ).joinPath( "api/:accessID/report/get/all" );

									requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

									callback( null, requestEndpoint );
								},

								function getReportListFromServer( requestEndpoint, callback ){
									$http.get( requestEndpoint )
										.success( function onSuccess( result, status ){
											callback( null, result.data );
										} )
										.error( function onError( result, status ){
											//: @todo: Do something on error.
											callback( new Error( "error sending report data" ), data );
										} );
								},

								function renderReportList( reportList, callback ){
									callback( );
								}
							],
								function lastly( state ){
									if( state ){
										console.error( error );
									}

									scope.finishLoading( );
								} );
						} );

					scope.on( "proceed-default-app-flow",
						function onProceedDefaultAppFlow( ){
							scope.publish( "hide-report-list" );
						} );
				}
			}
		}
	] );