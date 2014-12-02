Crime
	.directive( "confirmLocationControlController", [
		"Event",
		function directive( Event ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "report-control-clicked:report",
						function onReportControlClick( ){
							scope.publish( "show-confirm-location-control" );

							scope.isReporting = true;
						} );

					scope.on( "map-pointer-dragging",
						function onMapPointerDragging( ){
							if( scope.isReporting ){
								scope.publish( "hide-confirm-location-control" );	
							}
						} );

					scope.on( "map-pointer-dragged",
						function onMapPointerDragged( ){
							if( scope.isReporting ){
								scope.publish( "show-confirm-location-control" );	
							}
						} );


					scope.on( "map-dragging",
						function onMapPointerDragging( ){
							if( scope.isReporting ){
								scope.publish( "hide-confirm-location-control" );	
							}
						} );

					scope.on( "map-dragged",
						function onMapPointerDragged( ){
							if( scope.isReporting ){
								scope.publish( "show-confirm-location-control" );	
							}
						} );

					scope.on( "confirm-location-control-clicked:confirm-location",
						function onConfirmLocation( ){
							scope.publish( "hide-confirm-location-control" );

							scope.isReporting = false;
						} );
				}
			}
		}
	] );