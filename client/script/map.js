angular.module( "Map", [ "Event", "PageFlow" ] )
	.directive( "map", [
		"Event",
		"PageFlow",
		function directive( PageFlow ){
			var map = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						React.renderComponent( <map scope={ scope } />, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"mapZoom": 15,
						"mapZoomStart": 15,
						"mapZoomEnd": 25,
						"mapOptionSet": { },
						"mapState": "map-normal",
						"componentState": "",
						"resizeTimeout": null
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

				"createMap": function createMapComponent( ){
					if( "mapComponent" in this && 
						this.mapComponent &&
						this.mapComponent instanceof google.maps.Map )
					{
						return this.mapComponent;
					}

					var mapContainer = this.createMapContainer( );

					var mapComponent = new google.maps.Map( mapContainer, {
						"zoom": this.state.mapZoom,
						"minZoom": this.state.mapZoomStart,
						"maxZoom": this.state.mapZoomEnd,
						"center": this.state.position,
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
							self.scope.publish( "map-loaded" );
						} );

					google.maps.event.addListener( mapComponent, "zoom_changed",
						function onZoomChanged( event ){
						} );	

					google.maps.event.addListener( mapComponent, "dragend",
						function onDragEnd( event ){
						} );
				},

				"initializeMap": function initializeMap( ){
					if( !( this.mapComponent instanceof google.maps.Map ) ){
						this.createMapContainer( );

						this.createMap( );

						this.attachAllMapListener( );
					}
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "update-map-view",
						function onUpdateMapView( callback ){
					
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					return ( 
						<div className="map-container">
							<div className="map-component"></div>
						</div>
					);
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					if( !( this.map instanceof google.maps.Map ) && 
						this.state.position instanceof google.maps.LatLng )
					{
						this.initializeMap( );
					}
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.broadcast( "map-rendered" );
				}
			} );

			return {
				"restrict": "EA",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "map" );

					scope.on( "show-map",
						function onShowMap( ){
							scope.showPage( )
								.wholePage( ).wholePageCenter( );
						} );

					scope.on( "hide-map",
						function onHideMap( ){
							scope.hidePage( );
						} );

					$( window ).resize( function onResize( ){
						scope.broadcast( "update-map-view" );
					} );

					scope.publish( "show-map" );

					map.attach( scope, element );
				}
			};
		}
	] );