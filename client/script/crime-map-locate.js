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
								function callback( address ){
									scope.publish( "set-current-address", address );
								} );
						} );		
				}
			};
		}
	] )