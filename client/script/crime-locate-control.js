Crime
	
	.directive( "locateControlController", [
		"Event",
		"ProgressBar",
		function directive( Event, ProgressBar ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					ProgressBar( scope );

					scope.on( "proceed-default-app-flow",
						function onProceedDefaultAppFlow( ){
							scope.publish( "show-locate-control" );
						} );

					scope.on( "locate-control-click:locate",
						function onLocate( ){
							scope.publish( "locate-current-position" );

							scope.startLoading( );
						} );

					scope.on( "current-position-located",
						function onCurrentPositionLocated( ){
							scope.publish( "relocate-map-locate-pointer" );

							scope.finishLoading( );
						} );
				}
			}
		}
	] );