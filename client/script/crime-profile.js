Crime
	.directive( "profileController", [
		"Event",
		function directive( Event ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "proceed-default-app-flow",
						function onProceedDefaultAppFlow( loginData ){
							scope.publish( "show-minified-profile" );

							scope.broadcast( "initiate-basic-profile-data-retrieval", loginData.loginType );
						} );
				}
			}
		}
	] );