Crime
	.directive( "dashList", [
		function directive( ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attribute ){
					scope.dashList = [
						{
							"name": "profile",
							"title": labelData.PROFILE_DASHBAR_LABEL
						},
						{
							"name": "report",
							"title": labelData.REPORT_DASHBAR_LABEL
						},
						{
							"name": "my-report",
							"title": labelData.MY_REPORT_DASHBAR_LABEL
						},
						{
							"name": "logout",
							"title": labelData.LOGOUT_DASHBAR_LABEL
						}
					];
				}
			};
		}
	] )

	.directive( "dashItemIconSet", [
		function directive( ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attribute ){
					scope.dashItemIconSet = {
						"profile": "ic_account_circle_24px",
						"report": "ic_report_problem_24px",
						"my-report": "ic_view_list_24px",
						"logout": "ic_home_24px"
					};
				}
			};
		}
	] )

	.directive( "dashbarController", [
		"Event",
		function directive( Event ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attribute ){
					Event( scope );

					scope.on( "logged-in",
						function onLoggedIn( ){
							scope.publish( "set-hidden-dash-item-list", [ ] );

							scope.publish( "show-minified-dashbar" );
						} );
				}
			};
		}
	] );