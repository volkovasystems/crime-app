angular.module( "MapLocatePointer", [ "Event" ] )

	.constant( "MAP_LOCATE_POINTER_ICON_WIDTH", staticData.MAP_LOCATE_POINTER_ICON_WIDTH )

	.constant( "MAP_LOCATE_POINTER_ICON_HEIGHT", staticData.MAP_LOCATE_POINTER_ICON_HEIGHT )

	.factory( "createLocatePointerImage", [
		"MAP_LOCATE_POINTER_ICON_WIDTH",
		"MAP_LOCATE_POINTER_ICON_HEIGHT",
		function factory(
			MAP_LOCATE_POINTER_ICON_WIDTH,
			MAP_LOCATE_POINTER_ICON_HEIGHT
		){
			var createLocatePointerImage = function createLocatePointerImage( imageSource ){
				var width = MAP_LOCATE_POINTER_ICON_WIDTH;
				
				var height = MAP_LOCATE_POINTER_ICON_HEIGHT;

				var locatePointerImage = {
					"url": imageSource,
					"scaledSize": new google.maps.Size( width, height ),
					"anchor": new google.maps.Point( width / 2, height / 2 )
				};

				return locatePointerImage;
			};

			return createLocatePointerImage;
		}
	] )

	.factory( "createMapLocatePointer", [
		"createLocatePointerImage",
		function factory( createLocatePointerImage ){
			var createMapLocatePointer = function createMapLocatePointer( map, pointerImageSource ){
				var locatePointerIcon = createLocatePointerImage( pointerImageSource );
				
				var mapLocatePointer = new google.maps.Marker( {
					"map": map,
					"draggable": false,
					"position": map.getCenter( ),
					"icon": locatePointerIcon,
					"optimized": false
				} );

				return mapLocatePointer;
			};

			return createMapLocatePointer;
		}
	] )

	.directive( "mapPointer", [
		"Event",
		"createMapLocatePointer",
		function directive( 
			Event,
			createMapLocatePointer
		){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "show-map-locate-pointer",
						function onShowMapPointer( ){
							if( scope.mapLocatePointer ){
								scope.mapLocatePointer.setVisible( true );
							}
						} );

					scope.on( "hide-map-locate-pointer",
						function onShowMapPointer( ){
							if( scope.mapLocatePointer ){
								scope.mapLocatePointer.setVisible( false );
							}
						} );

					scope.on( "create-map-locate-pointer",
						function onCreateMapPointer( pointerImageSource ){
							if( scope.mapLocatePointer ){
								scope.mapLocatePointer.setMap( null );

								scope.mapLocatePointer = null;
							}

							var mapLocatePointer = createMapLocatePointer( scope.mapComponent, pointerImageSource );

							mapLocatePointer.setVisible( false );

							scope.mapLocatePointer = mapLocatePointer;

							scope.publish( "map-locate-pointer-created", mapLocatePointer );
						} );
				}
			};
		}
	] );