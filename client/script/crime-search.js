Crime
	.directive( "searchController", [
		"Event",
		"PageFlow",
		function directive( Event, PageFlow ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "search" );

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
						} )

					scope.on( "show-listed-dashbar",
						function onShowDashbarListed( ){
							scope.applyFlow( "dashbar-listed-view" );
						} );

					scope.on( "show-minified-dashbar",
						function onShowDashbarListed( ){
							scope.removeFlow( "dashbar-listed-view" );
						} );
				}
			}
		}
	] );