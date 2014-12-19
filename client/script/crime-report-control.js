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

					scope.on( "report-control-click:report",
						function onReportControlClick( ){
							scope.publish( "hide-report-control" );

							$( "body" ).addClass( "reporting" );
						} );

					scope.on( "show-report-control",
						function onShowReportControl( ){
							$( "body" ).removeClass( "reporting" );
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

					scope.on( "close-report-final",
						function onCloseReportFinal( ){
							scope.publish( "show-report-control" );
						} );

					scope.on( "close-report-specify-category",
						function onCloseReportSpecifyCategory( ){
							scope.publish( "show-report-control" );
						} );

					scope.on( "close-report-incident-detail",
						function onCloseReportIncidentDetail( ){
							scope.publish( "show-report-control" );
						} );

					scope.on( "close-report-pin",
						function onCloseReportPin( stopFlag ){
							if( stopFlag ){
								scope.publish( "show-report-control" );	
							}
						} );

					scope.on( "open-report-pin",
						function onOpenReportPin( stopFlag ){
							if( stopFlag ){
								scope.publish( "hide-report-control" );	
							}
						} );
				}
			}
		}
	] );