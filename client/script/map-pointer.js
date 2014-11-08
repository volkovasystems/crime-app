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

	.factory( "createMapPointer", [
		"createPointerIcon",
		function factory( createPointerIcon ){
			var createMapPointer = function createMapPointer( map ){
				var pointerIcon = createPointerIcon( );

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

	.directive( "map-pointer", [
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

					scope.on( "map-view-rendered",
						function onMapViewRendered( ){
							var mapPointer = createMapPointer( scope.mapComponent );

							mapPointer.setVisible( true );

							attachMapPointerEventListener( mapPointer, scope );
						} );
				}
			};
		}
	] );