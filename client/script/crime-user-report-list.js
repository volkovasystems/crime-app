Crime

	.directive( "userReportListController", [
		"Event",
		"getReportList",
		function directive( 
			Event, 
			getReportList
		){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.pageSize = staticData.REPORT_LIST_PAGE_SIZE;

					scope.pageIndex = scope.pageIndex || 0;

					scope.on( "dash-clicked:my-report",
						function onNavigateMyReport( ){
							scope.publish( "show-user-report-list" );

							getReportList( scope,
								function onGetReportList( state, reportList ){
									if( state ){

									}else{
										scope.publish( "set-user-report-list", reportList );
									}
								} );
						} );

					scope.on( "close-user-report-list",
						function onCloseUserReportList( ){
							scope.publish( "hide-user-report-list" );
						} );

					scope.on( "login-success",
						function onLoginSuccess( ){
							getReportList( scope,
								function onGetReportList( state, reportList ){
									if( state ){

									}else{
										scope.publish( "set-user-report-list", reportList );
									}
								} );
						} );

					scope.on( "report-added",
						function onReportAdded( ){
							getReportList( scope,
								function onGetReportList( state, reportList ){
									if( state ){

									}else{
										scope.publish( "set-user-report-list", reportList );
									}
								} );
						} );
				}
			}
		}
	] );