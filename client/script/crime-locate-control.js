Crime
	
	.directive( "locateControlController", [
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
							scope.publish( "show-locate-control" );
						} );

					scope.on( "locate-control-click:locate",
						function onLocate( ){
							scope.publish( "locate-current-position" );
						} );
				}
			}
		}
	] );