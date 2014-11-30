angular.module( "MapInfoPin", [ "Event", "ReportDetail", "ReportPreview" ] )

	.constant( "MAP_INFO_PIN_LIST", [ ] )

	.constant( "OPEN_MAP_INFO_PIN_SET", { } )

	.constant( "EXPANDED_MAP_INFO_PIN_SET", { } )

	.factory( "createMapInfoPin", [
		"MAP_INFO_PIN_LIST",
		"OPEN_MAP_INFO_PIN_SET",
		"EXPANDED_MAP_INFO_PIN_SET",
		"attachReportDetail",
		"attachReportPreview",
		function factory( 
			MAP_INFO_PIN_LIST, 
			OPEN_MAP_INFO_PIN_SET,
			EXPANDED_MAP_INFO_PIN_SET,
			attachReportDetail, 
			attachReportPreview 
		){
			var createMapInfoPin = function createMapInfoPin( position, mapInfoData, mapComponent, scope ){
				var timeout = setTimeout( function onTimeout( ){

					var cleanMapInfoID = mapInfoData.mapInfoID.replace( /[^A-Za-z0-9]/g, "" );

					width = staticData.MAP_INFO_PIN_WIDTH;
					height = staticData.MAP_INFO_PIN_HEIGHT;
					
					if( EXPANDED_MAP_INFO_PIN_SET[ cleanMapInfoID ] ){
						width = staticData.MAP_INFO_PIN_EXPANDED_WIDTH;
						height = staticData.MAP_INFO_PIN_EXPANDED_HEIGHT;
					}

					var mapInfoPin = new google.maps.InfoWindow( {
						"content": [
							"<div @style>"
								.replace( "@style", [
									"style",
									[
										"\"",
										[
											[ "width", width ].join( ":" ),
											[ "height", height ].join( ":" )
										].join( ";" ),
										"\""
									].join( "" )
								].join( "=" ) ),
								"<div map-info-pin-expand id=\"@mapInfoID\"></div>",
								"<div map-info-pin id=\"@mapInfoID\"></div>",
							"</div>"
						].join( "" ).replace( /\@mapInfoID/g, cleanMapInfoID )
					} );

					scope.on( "pin-clicked",
						function onPinClick( mapInfoID, marker ){
							mapInfoPin.close( );

							if( mapInfoID == cleanMapInfoID ){
								if( _.contains( MAP_INFO_PIN_LIST, mapInfoPin ) && 
									!OPEN_MAP_INFO_PIN_SET[ cleanMapInfoID ] )
								{
									OPEN_MAP_INFO_PIN_SET[ cleanMapInfoID ] = marker;

									mapInfoPin.open( mapComponent, marker );	
								}	
							}
						} );

					scope.on( "report-detail-rendered",
						function onReportDetailRendered( reportDetailID, container ){
							if( reportDetailID == cleanMapInfoID ){
								container.attr( "has-rendered", "" );
							}
						} );

					scope.on( "report-preview-rendered",
						function onReportPreviewRendered( reportPreviewID, container ){
							if( reportPreviewID == cleanMapInfoID ){
								container.attr( "has-rendered", "" );
							}
						} );

					google.maps.event.addListener( mapInfoPin, "domready",
						function onDOMReady( ){
							var containerExpanded = $( "[map-info-pin-expand]#@mapInfoID"
								.replace( "@mapInfoID", cleanMapInfoID ) );

							var containerPreview = $( "[map-info-pin]#@mapInfoID"
								.replace( "@mapInfoID", cleanMapInfoID ) );

							if( !containerPreview.attr( "has-rendered" ) ){
								attachReportPreview( {
									"scope": scope,
									"element": containerPreview,
									"reportPreviewID": cleanMapInfoID,
									"reportData": mapInfoData.reportData
								} );
							}

							if( !containerExpanded.attr( "has-rendered" ) ){
								attachReportDetail( {
									"scope": scope,
									"element": containerExpanded,
									"reportDetailID": cleanMapInfoID,
									"reportData": mapInfoData.reportData
								} );
							}

							var container = containerPreview;

							if( EXPANDED_MAP_INFO_PIN_SET[ cleanMapInfoID ] ){
								container = containerExpanded;
							}

							var parentContainer = container.parents( "div.gm-style-iw" );

							var closeComponent = parentContainer.siblings( "div" ).find( "img" );
							closeComponent.remove( );

							parentContainer.css( {
								"top": "1px",
								"left": "1px",
								"width": "100%",
								"height": "99.7%"
							} );

							$( "div", parentContainer ).css( {
								"width": "100%",
								"height": "100%",
								"overflow": "hidden"
							} );

							$( "div > div", parentContainer ).css( {
								"width": "100%",
								"height": "100%",
								"overflow": "hidden"
							} );

							$( "[map-info-pin-expand]", parentContainer ).css( {
								"width": "100%",
								"height": "100%",
								"overflow": "hidden"
							} );
						} );

					google.maps.event.addListener( mapInfoPin, "closeclick",
						function onCloseClick( ){
							OPEN_MAP_INFO_PIN_SET[ cleanMapInfoID ] = false;
						} );

					if( OPEN_MAP_INFO_PIN_SET[ cleanMapInfoID ] && 
						!_.contains( MAP_INFO_PIN_LIST, mapInfoPin ) )
					{
						mapInfoPin.close( );

						mapInfoPin.open( mapComponent, OPEN_MAP_INFO_PIN_SET[ cleanMapInfoID ] );
					}

					MAP_INFO_PIN_LIST.push( mapInfoPin );

					clearTimeout( timeout );
				}, 100 );
			};

			return createMapInfoPin;
		}
	] )

	.directive( "mapInfoPin", [
		"Event",
		"createMapInfoPin",
		"MAP_INFO_PIN_LIST",
		"OPEN_MAP_INFO_PIN_SET",
		function directive( Event, createMapInfoPin, MAP_INFO_PIN_LIST, OPEN_MAP_INFO_PIN_SET ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "pin-clicked",
						function onPinClick( ){
							var mapInfoPin = _.find( MAP_INFO_PIN_LIST,
								function onEachMapInfoPin( mapInfoPin ){
									var mapInfoID = $( "div", mapInfoPin.getContent( ) ).attr( "id" );

									return !!OPEN_MAP_INFO_PIN_SET[ mapInfoID ];
								} );

							if( mapInfoPin ){
								OPEN_MAP_INFO_PIN_SET[ $( "div", mapInfoPin.getContent( ) ).attr( "id" ) ] = false;

								mapInfoPin.close( );
							}
						} );

					scope.on( "create-map-info-pin",
						function onCreateMapInfoPin( position, mapInfoData, mapComponent ){
							if( MAP_INFO_PIN_LIST.length ){
								var mapInfoPin = null;
								var mapInfoID = null;
								while(
									mapInfoPin = MAP_INFO_PIN_LIST.pop( ),
									google.maps.event.clearInstanceListeners( mapInfoPin ),
									mapInfoPin.close( ),
									mapInfoID = $( "div", mapInfoPin.getContent( ) ).attr( "id" ),
									( OPEN_MAP_INFO_PIN_SET[ mapInfoID ] )?
										OPEN_MAP_INFO_PIN_SET[ mapInfoID ] = OPEN_MAP_INFO_PIN_SET[ mapInfoID ]:
										OPEN_MAP_INFO_PIN_SET[ mapInfoID ] = false,
									MAP_INFO_PIN_LIST.length
								);
							}

							createMapInfoPin( position, mapInfoData, mapComponent, scope );
						} );
				}
			};
		}
	] );