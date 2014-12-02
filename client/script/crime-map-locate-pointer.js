Crime
	.directive( "mapLocatePointerController", [
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
							scope.publish( "create-map-locate-pointer", 
								staticData.MAP_LOCATE_POINTER_ICON );

							scope.publish( "show-map-locate-pointer" );
						} );
				}
			}
		}
	] )