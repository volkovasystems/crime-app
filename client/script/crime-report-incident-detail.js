Crime

	.directive( "reportIncidentDetailController", [
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

					scope.on( "send-report-incident-detail",
						function onConfirmReportIncidentDetail( ){
							scope.publish( "hide-report-incident-detail" );
						} );

					scope.on( "cancel-report-incident-detail",
						function onCancelReportIncidentDetail( ){
							scope.publish( "clear-report-incident-detail-data" );

							scope.publish( "hide-report-incident-detail" );
						} );

					scope.on( "confirm-report-specify-category",
						function onConfirmReportSpecifyCategory( ){
							scope.publish( "show-report-incident-detail" );
						} );

					scope.on( "close-report-final",
						function onCloseReportFinal( ){
							scope.publish( "clear-report-incident-detail-data" );
						} );

					scope.on( "close-report-incident-detail",
						function onCloseReportIncidentDetail( ){
							scope.publish( "clear-report-incident-detail-data" );

							scope.publish( "hide-report-incident-detail" );
						} );
				}
			};
		}
	] );