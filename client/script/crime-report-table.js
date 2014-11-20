Crime
	.directive( "reportTableController", [		
		"Event",		
		function directive( Event ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					var reports = [
						{
							"reportTitle": "Sunog",
							"reportDescription": "Sa Macabalan"
						},
						{
							"reportTitle": "Rape",
							"reportDescription": "Sa Macabalan"
						}
					];										

					scope.on('report-table-rendered' , 
						function ( ) {
							scope.publish('report-data' , reports);
						} );

					scope.on( "dash-clicked:report-table",
						function onNavigateProfile( ){
							scope.publish( "show-report-table" );
						} );

					scope.on( "show-report-table" , 
						function onShowReportTable ( ) {
							scope.publish( "hide-control" );
						} );
				}
			}
		}
	] );