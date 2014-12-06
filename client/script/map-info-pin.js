angular.module( "MapInfoPin", [ "Event", "ReportDetail", "ReportPreview" ] )

	.constant( "MAP_INFO_PIN_LIST", [ ] )

	.constant( "OPEN_MAP_INFO_PIN_SET", { } )

	.constant( "EXPANDED_MAP_INFO_PIN_SET", { } )

	.factory( "generateMapInfoPinContent", [
		function factory( ){
			var generateMapInfoPinContent = function generateMapInfoPinContent( mapInfoID, width, height ){
				return  [
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
				].join( "" ).replace( /\@mapInfoID/g, mapInfoID )
			};

			return generateMapInfoPinContent;
		}
	] )

	.factory( "createMapInfoPin", [
		"MAP_INFO_PIN_LIST",
		"OPEN_MAP_INFO_PIN_SET",
		"EXPANDED_MAP_INFO_PIN_SET",
		"attachReportDetail",
		"attachReportPreview",
		"generateMapInfoPinContent",
		function factory( 
			MAP_INFO_PIN_LIST, 
			OPEN_MAP_INFO_PIN_SET,
			EXPANDED_MAP_INFO_PIN_SET,
			attachReportDetail, 
			attachReportPreview,
			generateMapInfoPinContent
		){
			var createMapInfoPin = function createMapInfoPin( position, mapInfoData, mapComponent, scope ){
				var timeout = setTimeout( function onTimeout( ){
					position = new google.maps.LatLng( position.latitude, position.longitude );

					var cleanMapInfoID = mapInfoData.mapInfoID.replace( /[^A-Za-z0-9]/g, "" );

					var width = staticData.MAP_INFO_PIN_WIDTH;
					var height = staticData.MAP_INFO_PIN_HEIGHT;

					if( EXPANDED_MAP_INFO_PIN_SET[ cleanMapInfoID ] ){
						width = staticData.MAP_INFO_PIN_EXPANDED_WIDTH;
						height = staticData.MAP_INFO_PIN_EXPANDED_HEIGHT;						
					}

					var mapInfoPin = new google.maps.InfoWindow( {
						"content": generateMapInfoPinContent( cleanMapInfoID, width, height )
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

									//mapComponent.panTo( position );

									scope.publish( "open-report-pin", true );

									for( var mapInfoID in OPEN_MAP_INFO_PIN_SET ){
										if( cleanMapInfoID != mapInfoID ){
											scope.publish( "open-report-preview", mapInfoID, false );	
										}
									}
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

					scope.on( "close-report-detail",
						function onCloseReportDetail( reportDetailID, propagationFlag ){
							if( reportDetailID == cleanMapInfoID &&
								_.contains( MAP_INFO_PIN_LIST, mapInfoPin ) )
							{
								mapInfoPin.close( );

								OPEN_MAP_INFO_PIN_SET[ cleanMapInfoID ] = false;

								EXPANDED_MAP_INFO_PIN_SET[ cleanMapInfoID ] = false;

								scope.publish( "close-report-pin", propagationFlag );
							}

							for( var mapInfoID in OPEN_MAP_INFO_PIN_SET ){
								scope.publish( "open-report-preview", mapInfoID, false );
							}
						} );

					scope.on( "close-report-preview",
						function onCloseReportPreview( reportPreviewID, propagationFlag ){
							if( reportPreviewID == cleanMapInfoID &&
								_.contains( MAP_INFO_PIN_LIST, mapInfoPin ) )
							{
								mapInfoPin.close( );

								OPEN_MAP_INFO_PIN_SET[ cleanMapInfoID ] = false;

								scope.publish( "close-report-pin", propagationFlag );
							}

							for( var mapInfoID in OPEN_MAP_INFO_PIN_SET ){
								scope.publish( "open-report-preview", mapInfoID, false );
							}
						} );

					scope.on( "open-report-detail",
						function onOpenReportDetail( reportDetailID, propagationFlag ){
							if( reportDetailID == cleanMapInfoID &&
								_.contains( MAP_INFO_PIN_LIST, mapInfoPin ) )
							{
								EXPANDED_MAP_INFO_PIN_SET[ cleanMapInfoID ] = true;

								var width = staticData.MAP_INFO_PIN_EXPANDED_WIDTH;
								var height = staticData.MAP_INFO_PIN_EXPANDED_HEIGHT;

								var mapInfoPinContent = generateMapInfoPinContent( cleanMapInfoID, width, height );

								mapInfoPin.setContent( mapInfoPinContent );

								//mapComponent.panTo( position );

								scope.publish( "open-report-pin", propagationFlag );
							}
						} );

					scope.on( "open-report-preview",
						function onOpenReportDetail( reportPreviewID, propagationFlag ){
							if( reportPreviewID == cleanMapInfoID &&
								_.contains( MAP_INFO_PIN_LIST, mapInfoPin ) )
							{
								EXPANDED_MAP_INFO_PIN_SET[ cleanMapInfoID ] = false;

								var width = staticData.MAP_INFO_PIN_WIDTH;
								var height = staticData.MAP_INFO_PIN_HEIGHT;

								var mapInfoPinContent = generateMapInfoPinContent( cleanMapInfoID, width, height );

								mapInfoPin.setContent( mapInfoPinContent );

								//mapComponent.panTo( position );

								scope.publish( "open-report-pin", propagationFlag );
							}
						} );

					google.maps.event.addListener( mapInfoPin, "domready",
						function onDOMReady( ){
							if( !_.contains( MAP_INFO_PIN_LIST, mapInfoPin ) ){
								mapInfoPin.close( );

								return;
							}

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

								scope.publish( "show-report-detail", cleanMapInfoID );
								scope.publish( "hide-report-preview", cleanMapInfoID );

							}else{
								scope.publish( "show-report-preview", cleanMapInfoID );
								scope.publish( "hide-report-detail", cleanMapInfoID );
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
				}, 0 );
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
								var mapInfoID = $( "div", mapInfoPin.getContent( ) ).attr( "id" );

								OPEN_MAP_INFO_PIN_SET[ mapInfoID ] = false;

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