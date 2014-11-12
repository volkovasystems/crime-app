Crime
	.factory( "getReportList", [
		"ProgressBar",
		"Event",
		"$http",
		"getReportServerData",
		function factory( ProgressBar, Event, $http, getReportServerData ){
			var getReportList = function getReportList( scope, callback ){
				var callback = callback || function callback( ){ };

				ProgressBar( scope );
				
				Event( scope );

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
							.success( function onSuccess( response, status ){
								callback( null, response.data );
							} )
							.error( function onError( response, status ){
								//: @todo: Do something on error.
								callback( new Error( "error sending report data" ), response );
							} );
					},

					function renderReportList( reportList, callback ){
						scope.publish( "set-report-list", reportList );

						callback( );
					}
				],
					function lastly( state, response ){
						if( state instanceof Error ){
							scope.publish( "error", "report-list-error", state, response );
						
						}else{
							callback( );
						}

						scope.finishLoading( );
					} );
			};

			return getReportList;
		}
	] )

	.directive( "reportListController", [
		"ProgressBar",
		"Event",
		"getReportList",
		function directive( ProgressBar, Event, getReportList ){
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
							getReportList( scope,
								function onGetReportList( ){
									scope.publish( "show-report-list" );		
								} );
						} );

					scope.on( "report-added",
						function onReportAdded( ){
							getReportList( scope,
								function onGetReportList( ){
									scope.publish( "show-report-list" );		
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