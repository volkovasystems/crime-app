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
						"profile": "md-person",
						"my-report": "md-list",
						"logout": "md-exit-to-app"
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