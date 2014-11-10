Crime
	.directive( "reportListController", [
		"Event",
		"$http",
		"getReportServerData",
		function directive( Event, $http, getReportServerData ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
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
								function getUserAccountData( callback ){
									scope.publish( "get-user-account-data",
										function onGetUserAccountData( error, userAccountData ){
											callback( error, userAccountData );
										} );
								},

								function getReportListFromServer( userAccountData, callback ){
									var requestEndpoint = getReportServerData( ).joinPath( "api/:accessID/report/get/all" );

									var hashedAccessID = btoa( userAccountData.accessToken ).replace( /[^A-Za-z0-9]/g, "" );

									requestEndpoint = requestEndpoint.replace( ":accessID", hashedAccessID );

									$http.get( requestEndpoint )
										.success( function onSuccess( data, status ){
											callback( null, data );
										} )
										.error( function onError( data, status ){
											//: @todo: Do something on error.
											callback( new Error( "error sending report data" ), data );
										} );
								}
							] );
						} );

					scope.on( "proceed-default-app-flow",
						function onProceedDefaultAppFlow( userAccountData ){

						} );
				}
			}
		}
	] );