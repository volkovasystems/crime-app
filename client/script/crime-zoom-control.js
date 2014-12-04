Crime

	.directive( "zoomControlController", [
		"Event",
		function directive( Event ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "proceed-default-app-flow",
						function onProceedDefaultAppFlow( ){
							scope.publish( "show-zoom-control" );
						} );

					scope.on( "zoom-control-click:zoom-in",
						function onZoomIn( ){
							scope.publish( "map-zoom-in" );
						} );

					scope.on( "zoom-control-click:zoom-out",
						function onZoomOut( ){
							scope.publish( "map-zoom-out" );
						} );
				}
			}
		}
	] );