angular.module( "MapMarker", [ "Event", "Transvg" ] )

	.constant( "MAP_MARKER_LIST", [ ] )

	.factory( "createMapMarker", [
		"Transvg",
		"MAP_MARKER_LIST",
		function factory( Transvg, MAP_MARKER_LIST ){
			var createMapMarker = function createMapMarker( position, iconData, mapComponent, scope ){
				if( ( /\.svg$/ ).test( iconData.sourceURL ) ){
					$.get( iconData.sourceURL,
						function onResult( svgData ){
							var svgSourceElement = $( svgData );

							var pathDataList = Transvg( svgSourceElement )
								.getPathDataList( iconData.iconName );

							_.each( pathDataList,
								function onEachPathDataList( pathData ){
									pathData.scale = 2;
									pathData.origin = new google.maps.Point( 0, 0 );
									pathData.anchor = new google.maps.Point( 11.5, 23.5 );

									var marker = new google.maps.Marker( {
										"position": new google.maps.LatLng( position.latitude, position.longitude ),
										"icon": pathData,
										"map": mapComponent
									} );

									google.maps.event.addListener( marker, "click",
										function onClick( ){
											scope.publish( "pin-clicked", position.latitude, position.longitude );
										} );

									MAP_MARKER_LIST.push( marker );
								} );
						} );

				}else{
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
								scope.publish( "pin-clicked", position.latitude, position.longitude );
							} );

						MAP_MARKER_LIST.push( marker );

						clearTimeout( timeout );
					}, 1000 );
				}
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