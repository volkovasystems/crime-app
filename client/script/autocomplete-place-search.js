angular

	.module( "AutocompletePlaceSearch", [ "Event" ] )

	.directive( "autocompletePlaceSearch", [
		"Event",
		function directive( Event ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.autocompleteComponent = new google.maps.places.Autocomplete( $( "input[type='text']", element )[ 0 ], { "types": [ "geocode" ] } );
				
					google.maps.event.addListener( scope.autocompleteComponent, "place_changed",
						function onPlaceChanged( ){
							scope.publish( "set-search-text", scope.autocompleteComponent.getPlace( ).formatted_address );
						} );
				}
			};
		}
	] );