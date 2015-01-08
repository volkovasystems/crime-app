angular.module( "MapMarker", [ "Event" ] )

	.constant( "MAP_MARKER_LIST", [ ] )

	.factory( "createMapMarker", [
		"MAP_MARKER_LIST",
		function factory( MAP_MARKER_LIST ){
			var createMapMarker = function createMapMarker( position, iconData, mapComponent, scope ){
				var timeout = setTimeout( function onTimeout( ){
					var width = staticData.MAP_MARKER_WIDTH;

					var height = staticData.MAP_MARKER_HEIGHT;

					var cleanMarkerID = iconData.markerID.replace( /[^A-Za-z0-9]/g, "" );

					var markerIcon = {
						"url": iconData.sourceURL,
						"scaledSize": new google.maps.Size( width, height )
					};

					var markerPosition = new google.maps.LatLng( position.latitude, position.longitude );

					var marker = new google.maps.Marker( {
						"map": mapComponent,
						"icon": markerIcon,
						"position": markerPosition
					} );

					google.maps.event.addListener( marker, "click",
						function onClick( ){
							scope.publish( "pin-clicked", cleanMarkerID, marker );
						} );

					scope.on( "open-map-marker",
						function onOpenMapMarker( markerID ){
							if( cleanMarkerID == markerID.replace( /[^A-Za-z0-9]/g, "" ) ){
								google.maps.event.trigger( marker, "click" );

								var timeout = setTimeout( function onTimeout( ){
									mapComponent.setCenter( markerPosition );

									clearTimeout( timeout );
								}, 100 );
							}
						} );

					scope.on( "open-map-marker",
						function onOpenMapMarker( markerID ){
							if( cleanMarkerID == markerID.replace( /[^A-Za-z0-9]/g, "" ) ){
								var timeout = setTimeout( function onTimeout( ){
									mapComponent.setCenter( markerPosition );

									clearTimeout( timeout );
								}, 100 );
							}
						} );

					scope.publish( "map-marker-created", cleanMarkerID );

					MAP_MARKER_LIST.push( marker );

					clearTimeout( timeout );
				}, 0 );
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