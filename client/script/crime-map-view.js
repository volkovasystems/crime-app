Crime
	.directive( "mapViewController", [
		"Event",
		function directive( Event ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attribute ){
					Event( scope );

					scope.on( "proceed-default-app-flow",
						function onProceedDefaultAppFlow( ){
							scope.broadcast( "set-control-list",
								[
									{
										"reference": "map-view",
										"name": "zoom-in",
										"icon": "ic_add_circle_outline_24px"
									},
									{
										"reference": "map-view",
										"name": "zoom-out",
										"icon": "ic_remove_circle_outline_24px"
									}
								], false );

							scope.publish( "show-control" );
						} );

					scope.on( "control-click:zoom-in",
						function onZoomIn( ){
							scope.broadcast( "map-zoom-in" );
						} );

					scope.on( "control-click:zoom-out",
						function onZoomOut( ){
							scope.broadcast( "map-zoom-out" );
						} );
				}
			};
		}
	] );