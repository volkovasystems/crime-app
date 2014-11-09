Crime
	.directive( "mapLocateController", [
		"Event",
		"getAddressAtPosition",
		function directive( Event, getAddressAtPosition ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeList ){
					Event( scope );
					
					scope.on( "map-position-changed",
						function onMapPositionChanged( position ){
							getAddressAtPosition( position,
								function callback( error, address ){
									if( error ){
										//: @todo: Do some error handling here!

									}else{
										scope.publish( "set-current-address", address );	
									}
								} );
						} );	

					scope.on( "proceed-default-app-flow",
						function onProceedDefaultAppFlow( ){
							scope.broadcast( "set-control-list",
								[
									{
										"reference": "crime-map-locate",
										"name": "crime-confirm-location",
										"title": "confirm",
										"icon": "ic_place_24px"
									}
								], true );
							
							scope.publish( "show-control" );
						} );	
				}
			};
		}
	] );