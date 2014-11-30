angular.module( "MapMarker", [ "Event" ] )

	.constant( "MAP_MARKER_LIST", [ ] )

	.factory( "createMapMarker", [
		"MAP_MARKER_LIST",
		function factory( MAP_MARKER_LIST ){
			var createMapMarker = function createMapMarker( position, iconData, mapComponent, scope ){
				var timeout = setTimeout( function onTimeout( ){
					var markerIcon = {
						"url": iconData.sourceURL,
						"scaledSize": new google.maps.Size( 41, 55 )
					};

					var marker = new google.maps.Marker( {
						"map": mapComponent,
						"icon": markerIcon,
						"position": new google.maps.LatLng( position.latitude, position.longitude )
					} );

					google.maps.event.addListener( marker, "click",
						function onClick( ){
							var cleanMarkerID = iconData.markerID.replace( /[^A-Za-z0-9]/g, "" );
							
							scope.publish( "pin-clicked", cleanMarkerID, marker );
						} );

					MAP_MARKER_LIST.push( marker );

					clearTimeout( timeout );
				}, 100 );
			};

			return createMapMarker;
		}
	] )

	.directive( "mapMarker", [
		"Event",
		"createMapMarker",
		"MAP_MARKER_LIST",
		function directive( Event, createMapMarker, MAP_MARKER_LIST ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "create-map-marker",
						function onCreateMapMarker( position, iconData, mapComponent ){
							if( MAP_MARKER_LIST.length ){
								var mapMarker = null;
								while(
									mapMarker = MAP_MARKER_LIST.pop( ),
									google.maps.event.clearInstanceListeners( mapMarker ),
									mapMarker.setMap( null ), 
									MAP_MARKER_LIST.length
								);	
							}

							createMapMarker( position, iconData, mapComponent, scope );
						} );
				}
			};
		}
	] );