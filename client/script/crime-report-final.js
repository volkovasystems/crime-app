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

					scope.on( "send-report",
						function onSendReport( ){
							scope.publish( "show-report-final" );
						} );

					scope.on( "send-report-incident-detail",
						function onSendReportIncidentDetail( ){
							scope.publish( "send-report" );
						} );

					scope.on( "report-sent",
						function onSendReport( ){
							scope.publish( "report-added" );
						} );

					scope.on( "close-report-final",
						function onCloseReportFinal( ){
							scope.publish( "hide-report-final" );
						} );
				}
			};
		}
	] );