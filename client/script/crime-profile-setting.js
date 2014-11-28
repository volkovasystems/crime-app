Crime
	.directive( "profileSettingController", [
		"Event",
		function directive( Event ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "dash-clicked:profile",
						function onNavigateProfile( ){
							scope.publish( "show-profile-setting" );
						} );

					scope.on( "close-profile-setting",
						function onCloseProfileSetting( ){
							scope.publish( "hide-profile-setting" );
						} );
				}
			}
		}
	] );