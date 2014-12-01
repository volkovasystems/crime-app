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

					scope.on( "proceed-default-app-flow",
						function onProceedDefaultAppFlow( ){
							scope.publish( "create-map-pointer", "../image/map-pointer.png" );
						} );

					scope.on( "report-control-clicked:report",
						function onReportControlClicked( ){
							scope.publish( "show-map-pointer" );
						} );
				}
			}
		}
	] )