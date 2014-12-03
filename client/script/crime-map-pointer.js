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
							scope.publish( "create-map-pointer", 
								staticData.MAP_POINTER_ICON );
						} );

					scope.on( "report-control-clicked:report",
						function onReportControlClicked( ){
							scope.publish( "show-map-pointer" );
						} );

					scope.on( "map-view-rendered",
						function onMapViewRendered( ){
							scope.publish( "create-map-pointer" );
						} );

					scope.on( "confirm-location-control-click:confirm-location",
						function onConfirmLocation( ){
							scope.publish( "hide-map-pointer" );
						} );

					scope.on( "confirm-location-control-click:cancel-location",
						function onConfirmLocation( ){
							scope.publish( "hide-map-pointer" );
						} );
				}
			}
		}
	] )