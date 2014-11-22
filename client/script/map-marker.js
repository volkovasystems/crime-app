angular.module( "MapMarker", [ "Event", "Transvg" ] )

	.factory( "createMapMarker", [
		"Transvg",
		function factory( Transvg ){
			var createMapMarker = function createMapMarker( position, iconSource, mapComponent ){
							
			};

			return createMapMarker;
		}
	] )

	.directive( "MapMarker", [
		"Event",
		function directive( Event ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "create-map-marker",
						function onCreateMapMarker( ){

						} );
				}
			};
		}
	] );