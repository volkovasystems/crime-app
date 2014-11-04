angular.module( "MapView", [ "Event", "PageFlow" ] )

	.constant( "DEFAULT_POSITION", new google.maps.LatLng( 14.5980716, 120.9797033 ) )

	.directive( "mapView", [
		"Event",
		"PageFlow",
		"DEFAULT_POSITION",
		"EVENT_PAGE_RESIZE",
		function directive( Event, PageFlow, DEFAULT_POSITION, EVENT_PAGE_RESIZE ){
			var mapUI = React.createClass( {
				"statics": {
					"configure": function configure( scope ){

					},

					"attach": function attach( scope, container ){
						React.renderComponent( <mapUI scope={ scope } />, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"mapZoom": 15,
						"mapZoomStart": 15,
						"mapZoomEnd": 25,
						"componentState": "map-normal"
					};
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"mapZoom": 15,
						"mapZoomStart": 15,
						"mapZoomEnd": 25
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
							self.scope.publish( "map-loaded", self.mapComponent );
						} );

					google.maps.event.addListener( mapComponent, "zoom_changed",
						function onZoomChanged( event ){
							self.scope.publish( "map-zoom-changed", self.state.mapZoom, self.mapComponent );
						} );	

					google.maps.event.addListener( mapComponent, "dragend",
						function onDragEnd( event ){
							self.scope.publish( "map-dragged", self.mapComponent );
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
					var mapZoomEnd = this.state.mapZoomEnd + 1;
					var mapZoom = this.state.mapZoom;

					mapZoom = ( mapZoom + 1 ) % mapZoomEnd || mapZoomStart;

					this.setState( {
						"mapZoom": mapZoom
					} );
				},

				"mapZoomOut": function mapZoomOut( ){
					var mapZoomStart = this.state.mapZoomStart;
					var mapZoomEnd = this.state.mapZoomEnd + 1;
					var mapZoom = this.state.mapZoom;

					mapZoom = ( mapZoom - 1 ) || mapZoomEnd;

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

					this.scope.on( "access-map-internal-environment",
						function onAccessMapInternalEnvironment( callback ){
							callback.call( self );
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					return ( 
						<div className="map-view-container">
							<div className="map-component"></div>
						</div>
					);
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					if( prevState.mapZoom != this.state.mapZoom ){
						this.setMapZoom( this.state.mapZoom );
					}

					if( !_.isEqual( prevState, this.state ) ){
						this.scope.emit( "map-view-state-changed", prevProps, prevState );
					}
				},

				"componentDidMount": function componentDidMount( ){
					this.initializeMap( );

					this.scope.publish( "map-view-rendered" );
				}
			} );

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

					mapUI.attach( scope, element );
				}
			};
		}
	] );