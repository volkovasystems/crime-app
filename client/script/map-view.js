angular.module( "MapView", [ "Event", "PageFlow" ] )

	.constant( "DEFAULT_POSITION", ( function( ){
		var latitude = staticData.DEFAULT_LATITUDE;

		var longitude = staticData.DEFAULT_LONGITUDE;

		return new google.maps.LatLng( latitude, longitude );
	} )( ) )

	.constant( "DEFAULT_MAP_ZOOM", staticData.DEFAULT_MAP_ZOOM )

	.constant( "DEFAULT_MAP_ZOOM_START", staticData.DEFAULT_MAP_ZOOM_START )

	.constant( "DEFAULT_MAP_ZOOM_END", staticData.DEFAULT_MAP_ZOOM_END )

	.factory( "MapView", [
		"DEFAULT_POSITION",
		"DEFAULT_MAP_ZOOM",
		"DEFAULT_MAP_ZOOM_START",
		"DEFAULT_MAP_ZOOM_END",
		function factory( 
			DEFAULT_POSITION,
			DEFAULT_MAP_ZOOM,
			DEFAULT_MAP_ZOOM_START,
			DEFAULT_MAP_ZOOM_END
		){
			var MapView = React.createClass( {
				"statics": {
					"configure": function configure( mapViewConfiguration ){
						this.mapZoom = mapViewConfiguration.mapZoom || DEFAULT_MAP_ZOOM;
						
						this.mapZoomStart = mapViewConfiguration.mapZoomStart || DEFAULT_MAP_ZOOM_START;
						
						this.mapZoomEnd = mapViewConfiguration.mapZoomEnd || DEFAULT_MAP_ZOOM_END;
						
						this.currentPosition = mapViewConfiguration.currentPosition || DEFAULT_POSITION;

						return this;
					},

					"attach": function attach( scope, container ){
						var mapViewComponent = <MapView 
							
							scope={ scope }
							
							mapZoom={ this.mapZoom }
							
							mapZoomStart={ this.mapZoomStart }
							
							mapZoomEnd={ this.mapZoomEnd }
							
							currentPosition={ this.currentPosition }/>

						React.render( mapViewComponent, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"currentPosition": DEFAULT_POSITION,
						"mapZoom": DEFAULT_MAP_ZOOM,
						"mapZoomStart": DEFAULT_MAP_ZOOM_START,
						"mapZoomEnd": DEFAULT_MAP_ZOOM_END,
						"componentState": "map-normal"
					};
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"currentPosition": DEFAULT_POSITION,
						"mapZoom": DEFAULT_MAP_ZOOM,
						"mapZoomStart": DEFAULT_MAP_ZOOM_START,
						"mapZoomEnd": DEFAULT_MAP_ZOOM_END
					};
				},

				"createMapContainer": function createMapContainer( ){
					if( "mapContainer" in this && 
						this.mapContainer &&
						this.mapContainer instanceof jQuery )
					{
						return this.mapContainer;
					}

					var mapContainer = $( ".map-component", this.getDOMNode( ) )[ 0 ];

					this.mapContainer = mapContainer;

					this.scope.mapContainer = mapContainer;

					return mapContainer;
				},

				"createMapComponent": function createMapComponent( ){
					if( "mapComponent" in this && 
						this.mapComponent &&
						this.mapComponent instanceof google.maps.Map )
					{
						return this.mapComponent;
					}

					var mapContainer = this.createMapContainer( );

					var mapComponent = new google.maps.Map( mapContainer, {
						"center": DEFAULT_POSITION,
						"zoom": this.props.mapZoom,
						"minZoom": this.props.mapZoomStart,
						"maxZoom": this.props.mapZoomEnd,
						"mapTypeControl": false,
						"overviewMapControl": false,
						"panControl": false,
						"streetViewControl": false,
						"scaleControl": false,
						"disableDefaultUI": true
					} );

					this.mapComponent = mapComponent;

					this.scope.mapComponent = mapComponent;

					return mapComponent;
				},

				"attachAllMapListener": function attachAllMapListener( ){
					var mapComponent = this.createMapComponent( );
					
					var self = this;

					google.maps.event.addListener( mapComponent, "tilesloaded",
						function onTilesLoaded( event ){
							self.scope.publish( "map-loaded", mapComponent );
						} );

					google.maps.event.addListener( mapComponent, "zoom_changed",
						function onZoomChanged( event ){
							self.scope.publish( "map-zoom-changed", self.state.mapZoom, mapComponent );
						} );

					google.maps.event.addListener( mapComponent, "dragstart",
						function onDragEnd( event ){
							self.scope.publish( "map-dragging", mapComponent );
						} );	

					google.maps.event.addListener( mapComponent, "dragend",
						function onDragEnd( event ){
							self.scope.publish( "map-dragged", mapComponent );
						} );

					google.maps.event.addListener( mapComponent, "center_changed",
						function onCenterChanged( event ){
							var centerPosition = mapComponent.getCenter( );
							if( _.isEmpty( centerPosition ) ){
								return;
							}

							if( !_.isEqual( self.state.currentPosition, mapComponent.getCenter( ) ) ){
								self.setState( {
									"currentPosition": mapComponent.getCenter( )
								}, function onStateChanged( ){
									self.scope.publish( "map-position-changed", self.state.currentPosition, mapComponent );		
								} );

							}else{
								self.scope.publish( "map-position-changed", self.state.currentPosition, mapComponent );
							}
						} );
				},

				"initializeMap": function initializeMap( ){
					if( !( this.mapComponent instanceof google.maps.Map ) ){
						this.createMapContainer( );

						this.createMapComponent( );

						this.attachAllMapListener( );
					}
				},

				"setMapZoom": function setMapZoom( mapZoom ){
					if( mapZoom != this.mapComponent.getZoom( ) ){
						if( mapZoom != this.state.mapZoom ){
							this.setState( {
								"mapZoom": mapZoom
							} );

						}else{
							this.mapComponent.setZoom( this.state.mapZoom );
						}	
					}
				},

				"mapZoomIn": function mapZoomIn( ){
					var mapZoomStart = this.state.mapZoomStart;
					
					var mapZoomEnd = this.state.mapZoomEnd;
					
					var mapZoom = this.state.mapZoom;

					mapZoom = mapZoom + 1;

					if( mapZoom > mapZoomEnd ){
						mapZoom = mapZoomStart;
					}

					this.setState( {
						"mapZoom": mapZoom
					} );
				},

				"mapZoomOut": function mapZoomOut( ){
					var mapZoomStart = this.state.mapZoomStart;
					
					var mapZoomEnd = this.state.mapZoomEnd;
					
					var mapZoom = this.state.mapZoom;

					mapZoom = mapZoom - 1;

					if( mapZoom < mapZoomStart ){
						mapZoom = mapZoomEnd;
					}

					this.setState( {
						"mapZoom": mapZoom
					} );
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "map-zoom-in",
						function onMapZoomIn( ){
							self.mapZoomIn( );
						} );

					this.scope.on( "map-zoom-out",
						function onMapZoomOut( ){
							self.mapZoomOut( );
						} );

					this.scope.on( "map-zoom-changed",
						function onMapZoomChanged( mapZoom ){
							var currentMapZoom = self.mapComponent.getZoom( ); 
							
							if( currentMapZoom != mapZoom ){
								self.setMapZoom( currentMapZoom );
							}
						} );

					this.scope.on( "get-map-zoom",
						function onGetMapZoom( callback ){
							callback( null, self.mapComponent.getZoom( ) );
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					var componentState = this.state.componentState;

					return; //: @template: template/map-view.html
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					if( prevState.mapZoom != this.state.mapZoom ){
						this.setMapZoom( this.state.mapZoom );
					}
				},

				"componentDidMount": function componentDidMount( ){
					this.initializeMap( );

					this.scope.publish( "map-view-rendered" );
				}
			} );

			return MapView;
		}
	] )

	.directive( "mapView", [
		"Event",
		"PageFlow",
		"EVENT_PAGE_RESIZE",
		"MapView",
		function directive( Event, PageFlow, EVENT_PAGE_RESIZE, MapView ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "map-view" );

					scope.on( "show-map-view",
						function onShowMap( ){
							scope.showPage( )
								.then.wholePage( )
								.then.wholePageCenter( );
						} );

					scope.on( "hide-map-view",
						function onHideMap( ){
							scope.hidePage( );
						} );

					scope.publish( "show-map-view" );

					MapView
						.configure( scope )
						.attach( scope, element );
				}
			};
		}
	] );