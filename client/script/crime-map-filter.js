Crime
	.directive( "mapFilterController", [
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

					/*scope.on( "proceed-default-app-flow",
						function onProceedDefaultAppFlow( ){
							scope.broadcast( "set-control-list",
								[
									{
										"reference": "crime-map-filter",
										"name": "crime-filter-location",
										"icon": "ic_filter_list_24px"
									}
								], true );
							
							scope.publish( "show-control" );
						} );*/
				}
			};
		}
	] );