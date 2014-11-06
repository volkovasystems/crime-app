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

					scope.on( "search-text-changed",
						function onSearchTextChanged( searchText ){
							
						} );
				}
			}
		}
	] );