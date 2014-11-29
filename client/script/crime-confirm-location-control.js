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
						} );
				}
			}
		}
	] );