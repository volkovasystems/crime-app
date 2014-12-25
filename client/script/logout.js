angular
	.module( "Logout", [ "Event" ] )

	.directive( "logout", [
		"Event",
		function directive( Event ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, element, attribute ){
					Event( scope );

					scope.on( "logout",
						function onLogout( ){
							scope.publish( "initiate-logout-procedure" );
						} );
				}
			}
		}
	] );