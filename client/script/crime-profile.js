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

					scope.on( "logged-in",
						function onLoggedIn( loginType ){
							scope.broadcast( "initiate-basic-profile-data-retrieval", loginType );
						} );

					scope.on( "profile-ready",
						function onProfileReady( ){
							scope.publish( "show-profile" );
						} );

					scope.on( "dash-clicked:profile",
						function onNavigateProfile( ){
							scope.publish( "show-dashbar-sub-view" );
						} );

					scope.on( "close-profile",
						function onCloseProfile( ){
							scope.publish( "show-minified-dashbar" );
						} );

					scope.on( "close-profile-setting",
						function onCloseProfileSetting( ){
							scope.publish( "show-dashbar-main-view" );
						} );
				}
			}
		}
	] );