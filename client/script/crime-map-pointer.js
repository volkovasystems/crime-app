Crime
	.directive( "mapPointerController", [
		"Event",
		function directive( Event ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "map-position-changed",
						function onMapPositionChanged( position ){
							scope.mapPointer.setPosition( position );
						} );	

					scope.on( "map-pointer-dragged",
						function onMapPointerDragged( mapPointer ){
							scope.mapComponent.setCenter( mapPointer.getPosition( ) );
						} );
				}
			}
		}
	] )