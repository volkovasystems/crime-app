Crime

	.factory( "filterCaseCategory", [
		"Event",
		"ProgressBar",
		"$http",
		"getReportServerData",
		function factory( 
			Event,
			ProgressBar,
			$http,
			getReportServerData
		){
			var filterCaseCategory = function filterCaseCategory( scope, selectedCaseCategory, callback ){
				Event( scope );

				ProgressBar( scope );

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

						callback( null, accessID );
					},

					function processRequestEndpoint( accessID, callback ){
						var requestEndpoint = getReportServerData( ).joinPath( "api/:accessID/report/filter/by/reportCaseType" );

						requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

						var queryString= _( [ selectedCaseCategory ] )
							.flatten( )
							.compact( )
							.map( function onEachCaseCategory( caseCategory ){
								return [ "propertyValue", caseCategory ].join( "=" )
							} )
							.value( )
							.join( "&" );

						requestEndpoint = [
							requestEndpoint,
							URI.encodeReserved( queryString )
						].join( "?" );

						callback( null, requestEndpoint );
					},

					function getAllFilteredReportFromServer( requestEndpoint, callback ){
						$http.get( requestEndpoint )
							.success( function onSuccess( response, status ){
								if( response.status == "error" ){
									callback( response.data );

								}else if( response.status == "failed" ){
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
					function lastly( error, reportList ){
						callback( error, reportList );

						scope.finishLoading( );
					} );
			};

			return filterCaseCategory;
		}
	] )

	.directive( "caseCategoryFilterController", [
		"Event",
		"filterCaseCategory",
		function directive( 
			Event,
			filterCaseCategory
		){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "close-case-category-filter",
						function onCloseCaseCategoryFilter( ){
							scope.publish( "hide-case-category-filter" );

							scope.publish( "clear-case-category-filter-data" );
						} );

					scope.on( "open-case-category-filter",
						function onCloseCaseCategoryFilter( ){
							scope.publish( "show-case-category-filter" );
						} );

					scope.on( "filter-by-case-category",
						function onFilterByCaseCategory( selectedCaseCategory ){
							filterCaseCategory( scope, selectedCaseCategory,
								function onFilterByCaseCategory( error, reportList ){
									if( error ){
										//: @todo: Notify error.

									}else{
										scope.publish( "map-all-filtered-report", reportList );
									}
								} );
						} );
				}
			};
		}
	] );