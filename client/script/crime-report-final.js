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

					scope.on( "open-my-report",
						function onOpenMyReport( ){
							scope.publish( "close-report-final" );
						} );

					scope.on( "get-report-reference",
						function onGetReportReference( callback ){
							scope.publish( "get-report-incident-detail-data",
								function onGetReportIncidentDetailData( error, reportData ){
									var reportReferenceTitle = reportData.title
										.trim( )
										.replace( /[^a-zA-Z0-9\s]+/g, "" )
										.replace( /\s+/g, "-" );

									var reportReferenceID = btoa( [
											reportData.timestamp,
											reportReferenceTitle
										].join( ":" ) )
										.substring( 0, 10 );

									var reportReference = [
										reportReferenceTitle,
										reportReferenceID
									].join( "-" );			
										
									callback( null, reportReference );
								} );
						} );
				}
			};
		}
	] );