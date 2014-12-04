Crime

	.directive( "profileController", [
		"Event",
		"getUserData",
		function directive( Event, getUserData ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "logged-in",
						function onLoggedIn( loginType ){
							scope.publish( "initiate-basic-profile-data-retrieval", loginType );
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

					scope.on( "user-data-updated",
						function onUserDataUpdated( ){
							getUserData( scope,
								function onGetUserData( error, userData ){
									if( error ){

									}else{
										scope.publish( "set-profile-data", userData );
									}
								} );
						} );

					scope.on( "login-success",
						function onShowProfile( ){
							getUserData( scope,
								function onGetUserData( error, userData ){
									if( error ){

									}else{
										scope.publish( "set-profile-data", userData );
									}
								} );
						} );
				}
			}
		}
	] );