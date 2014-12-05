Crime

	.directive( "searchController", [
		"Event",
		function directive( Event ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "proceed-default-app-flow",
						function onProceedDefaultAppFlow( loginData ){
							scope.publish( "show-search" );
						} );

					scope.on( "search-text-changed",
						function onSearchTextChanged( searchText ){
							scope.publish( "set-position-at-address", searchText );							
						} );

					scope.on( "set-current-address",
						function onSetCurrentAddress( address ){
							scope.publish( "set-search-text", address );
						} );

					scope.on( "close-report-pin",
						function onCloseReportPin( stopFlag ){
							if( stopFlag ){
								scope.publish( "show-search" );	
							}
						} );

					scope.on( "open-report-pin",
						function onOpenReportPin( stopFlag ){
							if( stopFlag ){
								scope.publish( "hide-search" );	
							}
						} );
				}
			}
		}
	] );