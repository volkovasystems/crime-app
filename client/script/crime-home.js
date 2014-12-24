Crime

	.constant( "CRIME_LOGO_IMAGE_SOURCE", staticData.CRIME_LOGO_IMAGE_SOURCE )

	.directive( "homeController", [
		"Event",
		"CRIME_LOGO_IMAGE_SOURCE",
		function directive( 
			Event, 
			CRIME_LOGO_IMAGE_SOURCE 
		){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "show-home",
						function onShowHome( ){
							scope.broadcast( "change-logo-image", CRIME_LOGO_IMAGE_SOURCE );
						} );
				}
			};
		}
	] );