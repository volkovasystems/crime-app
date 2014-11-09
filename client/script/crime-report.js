Crime
	.directive( "reportController", [
		"Event",
		"ProgressBar",
		function directive( Event, ProgressBar ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					ProgressBar( scope );

					Event( scope );

					scope.on( "control-click:confirm-location",
						function onConfirmLocation( ){
							async.waterfall( [
								function initiateLoading( callback ){
									scope.startLoading( );

									callback( );
								},

								function getCurrentPosition( callback ){
									scope.publish( "get-current-position", 
										function delegateCallback( error, position ){
											callback( error, position );
										} );
								},

								function getMapZoom( position, callback ){
									scope.publish( "get-map-zoom", 
										function delegateCallback( error, zoom ){
											callback( error, position, zoom );
										} );
								},

								function getCurrentAddress( position, zoom, callback ){
									scope.publish( "get-current-address",
										function delegateCallback( error, address ){
											callback( error, position, zoom, address );
										} )
								},

								function showReport( position, zoom, address, callback ){
									scope.publish( "set-report-data", {
										"position": position,
										"zoom": zoom,
										"address": address
									}, function delegateCallback( ){
										scope.publish( "show-report" );
										
										callback( );
									} );
								}
							],
								function lastly( error ){
									scope.finishLoading( );
								} );
						} );
				}
			}
		}
	] );