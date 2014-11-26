Crime
	.directive( "dashList", [
		function directive( ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attribute ){
					scope.dashList = [
						"home",
						"report",
						"report-list",
						"report-table",
						"locate",
						"profile",
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
						"home": "ic_home_24px",
						"report": "ic_report_problem_24px",
						"report-list": "ic_view_list_24px",
						"locate": "ic_my_location_24px",
						"profile": "ic_account_circle_24px",
						"report-table": "ic_account_circle_24px"
					};
				}
			};
		}
	] )

	.directive( "hiddenDashItemList", [
		function directive( ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,

				"link": function onLink( scope, element, attribute ){
					scope.hiddenDashItemList = [
						"report",
						"report-list",
						"report-table",
						"locate",
						"profile"
					];
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