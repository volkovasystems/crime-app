Crime
	/*:
		This will get all the user's reports.
	*/
	.factory( "getReportList", [
		"ProgressBar",
		"Event",
		"$http",
		"getReportServerData",
		function factory( ProgressBar, Event, $http, getReportServerData ){
			var getReportList = function getReportList( scope, callback ){
				var callback = callback || function callback( ){ };

				var rootCallback = callback;

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

					function checkUserAccountData( userAccountData, callback ){
						if( _.isEmpty( userAccountData ) ){
							getReportList( scope, rootCallback );

							callback( "recurse" );

						}else{
							callback( null, userAccountData );
						}
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
								if( response.status == "failed" ){
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
					function lastly( state, reportList ){
						scope.finishLoading( );

						if( state === "recurse" ){
							//: Do nothing?

						}else if( typeof state == "string" ){
							callback( state );

						}else if( state instanceof Error ){
							callback( state );
						
						}else{
							callback( null, reportList );
						}
					} );
			};

			return getReportList;
		}
	] )

	/*:
		This will get all the latest pending reports.
	*/
	.factory( "getAllPendingReportList", [
		"ProgressBar",
		"Event",
		"$http",
		"getReportServerData",
		function factory( ProgressBar, Event, $http, getReportServerData ){
			var getAllPendingReportList = function getAllPendingReportList( scope, callback ){
				var callback = callback || function callback( ){ };

				var rootCallback = callback;

				ProgressBar( scope );
				
				Event( scope );

				var count = scope.pageSize;

				var index = scope.pageIndex;

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

					function checkUserAccountData( userAccountData, callback ){
						if( _.isEmpty( userAccountData ) ){
							getReportList( scope, rootCallback );

							callback( "recurse" );

						}else{
							callback( null, userAccountData );
						}
					},

					function processAccessID( userAccountData, callback ){
						var accessID = btoa( userAccountData.accessToken ).replace( /[^A-Za-z0-9]/g, "" );

						callback( null, accessID );
					},

					function processRequestEndpoint( accessID, callback ){
						var requestEndpoint = getReportServerData( )
							.joinPath( "api/:accessID/report/query/latest/pending" );

						requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

						if( count ){
							requestEndpoint = [
								requestEndpoint,
								[
									[ "count", count ].join( "=" ),
									[ "index", index ].join( "=" )
								].join( "&" )
							].join( "?" );
						}

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
								callback( new Error( "error getting report data" ) );
							} );
					},
				],
					function lastly( state, reportList ){
						scope.finishLoading( );

						if( state === "recurse" ){
							//: Do nothing?

						}else if( typeof state == "string" ){
							callback( state );

						}else if( state instanceof Error ){
							callback( state );
						
						}else{
							callback( null, reportList );
						}
					} );
			};

			return getAllPendingReportList;
		}
	] )

	/*:
		This will get all the latest approved reports.
	*/
	.factory( "getAllApprovedReportList", [
		"ProgressBar",
		"Event",
		"$http",
		"getReportServerData",
		function factory( ProgressBar, Event, $http, getReportServerData ){
			var getAllApprovedReportList = function getAllApprovedReportList( scope, callback ){
				var callback = callback || function callback( ){ };

				var rootCallback = callback;

				ProgressBar( scope );
				
				Event( scope );

				var count = scope.pageSize;

				var index = scope.pageIndex;

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

					function checkUserAccountData( userAccountData, callback ){
						if( _.isEmpty( userAccountData ) ){
							getReportList( scope, rootCallback );

							callback( "recurse" );

						}else{
							callback( null, userAccountData );
						}
					},

					function processAccessID( userAccountData, callback ){
						var accessID = btoa( userAccountData.accessToken ).replace( /[^A-Za-z0-9]/g, "" );

						callback( null, accessID );
					},

					function processRequestEndpoint( accessID, callback ){
						var requestEndpoint = getReportServerData( )
							.joinPath( "api/:accessID/report/query/latest/approved" );

						requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

						if( count ){
							requestEndpoint = [
								requestEndpoint,
								[
									[ "count", count ].join( "=" ),
									[ "index", index ].join( "=" )
								].join( "&" )
							].join( "?" );
						}

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
								callback( new Error( "error getting report data" ) );
							} );
					}
				],
					function lastly( state, reportList ){
						scope.finishLoading( );

						if( state === "recurse" ){
							//: Do nothing?

						}else if( typeof state == "string" ){
							callback( state );

						}else if( state instanceof Error ){
							callback( state );
						
						}else{
							callback( null, reportList );
						}
					} );
			};

			return getAllApprovedReportList;
		}
	] )

	/*:
		This will get all the latest rejected reports.
	*/
	.factory( "getAllRejectedReportList", [
		"ProgressBar",
		"Event",
		"$http",
		"getReportServerData",
		function factory( ProgressBar, Event, $http, getReportServerData ){
			var getAllRejectedReportList = function getAllRejectedReportList( scope, callback ){
				var callback = callback || function callback( ){ };

				var rootCallback = callback;

				ProgressBar( scope );
				
				Event( scope );

				var count = scope.pageSize;

				var index = scope.pageIndex;

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

					function checkUserAccountData( userAccountData, callback ){
						if( _.isEmpty( userAccountData ) ){
							getReportList( scope, rootCallback );

							callback( "recurse" );

						}else{
							callback( null, userAccountData );
						}
					},

					function processAccessID( userAccountData, callback ){
						var accessID = btoa( userAccountData.accessToken ).replace( /[^A-Za-z0-9]/g, "" );

						callback( null, accessID );
					},

					function processRequestEndpoint( accessID, callback ){
						var requestEndpoint = getReportServerData( )
							.joinPath( "api/:accessID/report/query/latest/rejected" );

						requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

						if( count ){
							requestEndpoint = [
								requestEndpoint,
								[
									[ "count", count ].join( "=" ),
									[ "index", index ].join( "=" )
								].join( "&" )
							].join( "?" );
						}

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
								callback( new Error( "error getting report data" ) );
							} );
					}
				],
					function lastly( state, reportList ){
						scope.finishLoading( );

						if( state === "recurse" ){
							//: Do nothing?

						}else if( typeof state == "string" ){
							callback( state );

						}else if( state instanceof Error ){
							scope.publish( "error", "report-list-error", state );

							callback( state );
						
						}else{
							callback( null, reportList );
						}
					} );
			};

			return getAllRejectedReportList;
		}
	] )

	/*:
		This will get all the latest reports.
	*/
	.factory( "getAllReportList", [
		"ProgressBar",
		"Event",
		"$http",
		"getReportServerData",
		function factory( ProgressBar, Event, $http, getReportServerData ){
			var getAllReportList = function getAllReportList( scope, callback ){
				var callback = callback || function callback( ){ };

				var rootCallback = callback;

				ProgressBar( scope );
				
				Event( scope );

				var count = scope.pageSize;

				var index = scope.pageIndex;

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

					function checkUserAccountData( userAccountData, callback ){
						if( _.isEmpty( userAccountData ) ){
							getReportList( scope, rootCallback );

							callback( "recurse" );

						}else{
							callback( null, userAccountData );
						}
					},

					function processAccessID( userAccountData, callback ){
						var accessID = btoa( userAccountData.accessToken ).replace( /[^A-Za-z0-9]/g, "" );

						callback( null, accessID );
					},

					function processRequestEndpoint( accessID, callback ){
						var requestEndpoint = getReportServerData( )
							.joinPath( "api/:accessID/report/query/latest" );

						requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

						if( count ){
							requestEndpoint = [
								requestEndpoint,
								[
									[ "count", count ].join( "=" ),
									[ "index", index ].join( "=" )
								].join( "&" )
							].join( "?" );
						}

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
								callback( new Error( "error getting report data" ) );
							} );
					}
				],
					function lastly( state, reportList ){
						scope.finishLoading( );

						if( state === "recurse" ){
							//: Do nothing?

						}else if( typeof state == "string" ){
							callback( state );

						}else if( state instanceof Error ){
							callback( state );
						
						}else{
							callback( null, reportList );
						}
					} );
			};

			return getAllReportList;
		}
	] )

	.directive( "reportListController", [
		"Event",
		"getReportList",
		"getAllPendingReportList",
		"getAllApprovedReportList",
		"getAllRejectedReportList",
		"getAllReportList",
		function directive( 
			Event, 
			getReportList,
			getAllPendingReportList,
			getAllApprovedReportList,
			getAllRejectedReportList,
			getAllReportList
		){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.pageSize = staticData.REPORT_LIST_PAGE_SIZE;

					scope.pageIndex = scope.pageIndex || 0;

					scope.on( "login-success",
						function onLoginSuccess( ){
							getAllReportList( scope,
								function onGetAllReportList( state, reportList ){
									if( state ){

									}else{
										scope.publish( "set-report-list", reportList );
									}
								} );
						} );

					scope.on( "proceed-default-app-flow",
						function onProceedDefaultAppFlow( ){
							scope.publish( "show-minified-report-list" );
						} );

					scope.on( "show-report-incident-detail",
						function onShowReportIncidentDetail( ){
							scope.publish( "hide-report-list" );
						} );

					scope.on( "show-minified-report-list",
						function onShowMinifiedReportList( ){
							$( "body" ).removeClass( "report-feed-expanded" );
						} );

					scope.on( "show-expanded-report-list",
						function onShowExpandedReportList( ){
							$( "body" ).addClass( "report-feed-expanded" );
						} );

					scope.on( "close-report-final",
						function onCloseReportFinal( ){
							scope.publish( "show-minified-report-list" );
						} );

					scope.on( "report-added",
						function onLoginSuccess( ){
							getAllReportList( scope,
								function onGetAllReportList( state, reportList ){
									if( state ){

									}else{
										scope.publish( "set-report-list", reportList );
									}
								} );
						} );
				}
			}
		}
	] );