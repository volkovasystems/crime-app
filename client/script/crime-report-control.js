Crime
	.directive( "reportControlController", [
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
							scope.publish( "show-report-control" );
						} );

					scope.on( "report-control-clicked:report",
						function onReportControlClick( ){
							scope.publish( "hide-report-control" );
						} );

					scope.on( "confirm-location-control-click:cancel-location",
						function onConfirmLocation( ){
							scope.publish( "show-report-control" );
						} );

					scope.on( "cancel-report-specify-category",
						function onCancelReportSpecifyCategory( ){
							scope.publish( "show-report-control" );
						} );

					scope.on( "cancel-report-incident-detail",
						function onCancelReportIncidentDetail( ){
							scope.publish( "show-report-control" );
						} );
				}
			}
		}
	] );