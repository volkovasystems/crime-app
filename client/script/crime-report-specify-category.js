Crime
	.directive( "reportSpecifyCategoryController", [
		"Event",
		"$http",
		"getReportServerData",
		function directive( Event, $http, getReportServerData ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "confirm-location-control-click:confirm-location",
						function onConfirmLocation( ){
							async.waterfall( [
								function getCurrentPosition( callback ){
									scope.publish( "get-current-position",
										function onGetCurrentPosition( error, position ){
											callback( error, {
												"latitude": position.lat( ),
												"longitude": position.lng( )
											} );
										} );
								},

								function getMapZoom( position, callback ){
									scope.publish( "get-map-zoom",
										function onGetMapZoom( error, mapZoom ){
											position.zoom = mapZoom;

											callback( error, position );
										} );
								},

								function setReportSpecifyCategoryData( position, callback ){
									scope.publish( "set-report-specify-category-data", position );

									callback( );
								},

								function showReportSpecifyCategoryForm( callback ){
									scope.publish( "show-report-specify-category" );

									callback( );
								}
							],
								function lastly( state ){
									if( state instanceof Error ){
										
									}
								} );
						} );

					scope.on( "confirm-report-specify-category",
						function onConfirmReportSpecifyCategory( ){
							scope.publish( "hide-report-specify-category" );
						} );

					scope.on( "cancel-report-specify-category",
						function onCancelReportSpecifyCategory( ){
							scope.publish( "clear-report-specify-category-data" );

							scope.publish( "hide-report-specify-category" );
						} );
				}
			};
		}
	] );