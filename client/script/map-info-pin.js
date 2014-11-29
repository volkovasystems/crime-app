angular.module( "MapInfoPin", [ "Event", "ReportDetail" ] )

	.constant( "MAP_INFO_PIN_LIST", [ ] )

	.factory( "createMapInfoPin", [
		"MAP_INFO_PIN_LIST",
		"attachReportDetail",
		function factory( MAP_INFO_PIN_LIST, attachReportDetail ){
			var createMapInfoPin = function createMapInfoPin( position, mapInfoData, mapComponent, scope ){
				var timeout = setTimeout( function onTimeout( ){

					var cleanMapInfoID = mapInfoData.mapInfoID.replace( /[^A-Za-z0-9]/g, "" );

					var mapInfoPin = new google.maps.InfoWindow( {
						"content": [
							"<div @style>"
								.replace( "@style", [
									"style",
									"\"width:480px;height:720px;\""
								].join( "=" ) ),
								"<div map-info-pin-expand id=\"@mapInfoID\"></div>",
								"<div map-info-pin id=\"@mapInfoID\"></div>",
							"</div>"
						].join( "" ).replace( /\@mapInfoID/g, cleanMapInfoID )
					} );

					scope.on( "pin-clicked",
						function onPinClick( mapInfoID, marker ){
							if( mapInfoID == cleanMapInfoID ){
								mapInfoPin.open( mapComponent, marker );	
							}
						} );

					/*scope.on( "pin-clicked",
						function onPinClick( mapInfoID ){
							if( mapInfoID == cleanMapInfoID ){
								var timeout = setTimeout( function onTimeout( ){
									

									clearTimeout( timeout );
								}, 1000 );
							}
						} );*/

					google.maps.event.addListener( mapInfoPin, "domready",
						function onDOMReady( ){
							attachReportDetail( {
								"scope": scope,
								"element": $( "[map-info-pin-expand]#@mapInfoID"
									.replace( "@mapInfoID", cleanMapInfoID ) ),
								"reportDetailID": cleanMapInfoID,
								"reportData": mapInfoData.reportData
							} );
						} );

					MAP_INFO_PIN_LIST.push( mapInfoPin );

					clearTimeout( timeout );
				}, 1000 );
			};

			return createMapInfoPin;
		}
	] )

	.directive( "mapInfoPin", [
		"Event",
		"createMapInfoPin",
		"MAP_INFO_PIN_LIST",
		function directive( Event, createMapInfoPin, MAP_INFO_PIN_LIST ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "create-map-info-pin",
						function onCreateMapInfoPin( position, mapInfoData, mapComponent ){
							if( MAP_INFO_PIN_LIST.length ){
								var mapInfoPin = null;
								while(
									mapInfoPin = MAP_INFO_PIN_LIST.pop( ),
									google.maps.event.clearInstanceListeners( mapInfoPin ),
									mapInfoPin.setMap( null ), 
									MAP_INFO_PIN_LIST.length
								);	
							}

							createMapInfoPin( position, mapInfoData, mapComponent, scope );
						} );
				}
			};
		}
	] );