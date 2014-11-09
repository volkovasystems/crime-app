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

					scope.on( "control-click:crime-report-cancel",
						function onReportCancel( ){
							scope.publish( "hide-report" );
						} );

					scope.on( "control-click:crime-confirm-location",
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

					scope.on( "show-report",
						function onShowReport( ){
							scope.publish( "set-control-list",
								[
									{
										"reference": "crime-report",
										"name": "report-control-group",
										"controlList": [
											{
												"reference": "crime-report",
												"name": "crime-report-cancel",
												"title": "cancel",
												"icon": "ic_cancel_24px"
											},
											{
												"reference": "crime-report",
												"name": "crime-report-send",
												"title": "send",
												"icon": "ic_send_24px"
											}
										]
									}
								], true );
							
							scope.publish( "show-control" );
						} );

					scope.on( "hide-report",
						function onHideReport( ){
							scope.publish( "remove-control", "crime-report" );
						} );
				}
			}
		}
	] );