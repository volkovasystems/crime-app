angular.module( "MapPointer", [ "Event" ] )

	.factory( "createPointerIcon", [
		function factory( ){
			var createPointerIcon = function createPointerIcon( ){
				var pointerIcon = {
					"path": google.maps.SymbolPath.CIRCLE,
					"scale": 25,
					"strokeWeight": 5,
					"strokeColor": "#ff0000",
					"origin": new google.maps.Point( 0, 0 ),
					"anchor": new google.maps.Point( 0, 0 )
				};

				return pointerIcon;
			};

			return createPointerIcon;
		}
	] )

	.factory( "createPointerImage", [
		function factory( ){
			var createPointerImage = function createPointerImage( imageSource ){
				var width = staticData.MAP_POINTER_WIDTH;

				var height = staticData.MAP_POINTER_HEIGHT;

				var pointerImage = {
					"url": imageSource,
					"scaledSize": new google.maps.Size( width, height )
				};

				return pointerImage;
			};

			return createPointerImage;
		}
	] )

	.factory( "createMapPointer", [
		"createPointerIcon",
		"createPointerImage",
		function factory( createPointerIcon, createPointerImage ){
			var createMapPointer = function createMapPointer( map, pointerImageSource ){
				var pointerIcon = createPointerIcon( );

				if( pointerImageSource ){
					pointerIcon = createPointerImage( pointerImageSource );
				}
				
				var mapPointer = new google.maps.Marker( {
					"map": map,
					"draggable": true,
					"position": map.getCenter( ),
					"icon": pointerIcon
				} );

				return mapPointer;
			};

			return createMapPointer;
		}
	] )

	.factory( "attachMapPointerEventListener", [
		function factory( ){
			var attachMapPointerEventListener = function attachMapPointerEventListener( mapPointer, eventEngine ){
				google.maps.event.addListener( mapPointer, "dragstart",
					function onDragStart( event ){
						eventEngine.publish( "map-pointer-dragging", mapPointer, event );
					} );

				google.maps.event.addListener( mapPointer, "dragend",
					function onDragEnd( event ){
						eventEngine.publish( "map-pointer-dragged", mapPointer, event );
					} );

				google.maps.event.addListener( mapPointer, "mouseup",
					function onMouseUp( event ){
						eventEngine.publish( "map-pointer-mouseup", mapPointer, event );
					} );
			};

			return attachMapPointerEventListener;
		}
	] )

	.directive( "mapPointer", [
		"Event",
		"createMapPointer",
		"attachMapPointerEventListener",
		function directive( 
			Event,
			createMapPointer,
			attachMapPointerEventListener
		){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "show-map-pointer",
						function onShowMapPointer( ){
							if( scope.mapPointer ){
								scope.mapPointer.setVisible( true );
							}
						} );

					scope.on( "hide-map-pointer",
						function onShowMapPointer( ){
							if( scope.mapPointer ){
								scope.mapPointer.setVisible( false );
							}
						} );

					scope.on( "create-map-pointer",
						function onCreateMapPointer( pointerImageSource ){
							if( scope.mapPointer ){
								scope.mapPointer.setMap( null );

								scope.mapPointer = null;
							}

							var mapPointer = createMapPointer( scope.mapComponent, pointerImageSource );

							mapPointer.setVisible( false );

							attachMapPointerEventListener( mapPointer, scope );

							scope.mapPointer = mapPointer;

							scope.publish( "map-pointer-created", mapPointer );
						} );
				}
			};
		}
	] );