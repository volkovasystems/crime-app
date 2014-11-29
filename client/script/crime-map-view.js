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

					scope.on( "zoom-control-click:zoom-in",
						function onZoomIn( ){
							scope.broadcast( "map-zoom-in" );
						} );

					scope.on( "zoom-control-click:zoom-out",
						function onZoomOut( ){
							scope.broadcast( "map-zoom-out" );
						} );
				}
			};
		}
	] );