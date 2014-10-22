Crime.directive( "crimeLocate", [
	"PageFlow",
	function directive( PageFlow ){
		var DEFAULT_MAP_ADDRESS = "Manila, Philippines";

		var crimeLocate = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"mapZoom": 15,
					"mapZoomStart": 15,
					"mapZoomEnd": 25,
					"mapOptionSet": { },
					"position": { },
					"mapState": "normal",
					"resizeTimeout": null,
					"readableAddress": ""
				};
			},

			"createGeoCoder": function createGeoCoder( ){
				if( "geoCoder" in this &&
					this.geoCoder &&
					this.geoCoder instanceof google.maps.Geocoder )
				{
					return this.geoCoder;
				}

				var geoCoder = new google.maps.Geocoder( );

				this.geoCoder = geoCoder;

				return geoCoder;
			},

			"createMapContainer": function createMapContainer( ){
				if( "mapContainer" in this && 
					this.mapContainer &&
					this.mapContainer instanceof jQuery )
				{
					return this.mapContainer;
				}

				var mapContainer = $( ".map-container", this.getDOMNode( ) )[ 0 ];

				this.mapContainer = mapContainer;

				return mapContainer;
			},

			"createMap": function createMap( ){
				if( "map" in this && 
					this.map &&
					this.map instanceof google.maps.Map )
				{
					return this.map;
				}

				var mapContainer = this.createMapContainer( );

				var map = new google.maps.Map( mapContainer, {
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

				this.map = map;

				return map;
			},

			"createPointerIcon": function createPointerIcon( ){
				if( "pointerIcon" in this && 
					this.pointerIcon )
				{
					return this.pointerIcon;
				}

				var pointerIcon = {
					"path": google.maps.SymbolPath.CIRCLE,
					"scale": 25,
					"strokeWeight": 5,
					"strokeColor": "#ff0000",
					"origin": new google.maps.Point( 0, 0 ),
					"anchor": new google.maps.Point( 0, 0 )
				};

				this.pointerIcon = pointerIcon;

				return pointerIcon;
			},

			"createMapPointer": function createMapPointer( ){
				if( "mapPointer" in this && 
					this.mapPointer &&
					this.mapPointer instanceof google.maps.Marker )
				{
					return this.mapPointer;
				}

				var map = this.createMap( );
				
				var pointerIcon = this.createPointerIcon( );

				var mapPointer = new google.maps.Marker( {
					"map": map,
					"draggable": true,
					"position": this.state.position,
					"icon": pointerIcon 
				} );

				this.mapPointer = mapPointer;

				return mapPointer;
			},

			"attachAllMapListener": function attachAllMapListener( ){
				var map = this.createMap( );
				
				var mapPointer = this.createMapPointer( );

				var self = this;

				google.maps.event.addListener( map, "tilesloaded",
					function onTilesLoaded( event ){
						self.props.scope.$root.$broadcast( "map-loaded" );
					} );

				google.maps.event.addListener( map, "zoom_changed",
					function onZoomChanged( event ){
						self.setPosition( map.getCenter( ) );
					} );	

				google.maps.event.addListener( map, "dragend",
					function onDragEnd( event ){
						self.setPosition( map.getCenter( ) );
					} );
			},

			"attachAllMapPointerListener": function attachAllMapPointerListener( ){
				var mapPointer = this.createMapPointer( );

				var self = this;

				google.maps.event.addListener( mapPointer, "dragend",
					function onDragEnd( event ){
						self.setPosition( mapPointer.getPosition( ) );
					} );

				google.maps.event.addListener( mapPointer, "mouseup",
					function onMouseUp( event ){
						self.setPosition( mapPointer.getPosition( ) );
					} );
			},

			"initializeMap": function initializeMap( ){
				var self = this;

				if( !( this.state.position instanceof google.maps.LatLng ) ){
					this.loadCurrentPosition( );

				}else if( !( this.state.map instanceof google.maps.Map ) ){
					this.createMapContainer( );

					this.createMap( );

					this.createPointerIcon( );

					this.createMapPointer( );

					this.attachAllMapListener( );

					this.attachAllMapPointerListener( );
				}
			},

			"getAddressAtPosition": function getAddressAtPosition( position, callback ){
				var self = this;

				geoCoder.geocode( { "location": position }, 
					function onGeoCodeResult( results, status ){
						if( status == google.maps.GeocoderStatus.OK ){
							var readableAddress = _.map( results[ 0 ].address_components,
								function onEachAddressComponent( addressComponent ){
									return addressComponent.long_name;
								} )
								.join( ", " );

							if( typeof callback == "function" ){
								callback( null, readableAddress );
							}

						}else{
							self.props.scope.$root.$broadcast( "error", "locate-error", status, results );
						}
					} );
			},

			"getPositionAtAddress": function loadPositionAtAddress( address, callback ){
				var self = this;
				
				geoCoder.geocode( { "address": address }, 
					function onGeoCodeResult( results, status ){
						if( status == google.maps.GeocoderStatus.OK ){
							if( typeof callback == "function" ){
								callback( null, results[ 0 ].geometry.location );
							}

						}else{
							self.props.scope.$root.$broadcast( "error", "locate-error", status, results );
						}
					} );
			},

			"setPosition": function setPosition( position ){
				this.setState( {
					"position": position
				} );
			},

			"loadCurrentPosition": function loadCurrentPosition( ){
				var self = this;

				if( navigator.geolocation ){
					navigator.geolocation
						.getCurrentPosition( function onCurrentPosition( position ){
							var position = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
							
							self.setPosition( position );				
						} );

				}else{
					this.getPositionAtAddress( DEFAULT_MAP_ADDRESS,
						function onResult( error, position ){
							self.setPosition( position );
						} );
				}
			},

			"attachAllComponentEventListener": function attachAllComponentEventListener( ){
				var self = this;

				this.props.scope.$on( "show-zen-map",
					function onShowZenMap( ){
						self.setMapState( "zen" );
					} );

				this.props.scope.$on( "show-normal-map",
					function onShowNormalMap( ){
						self.setMapState( "normal" );
					} );

				this.props.scope.$on( "update-map-view",
					function onUpdateMapView( ){
						self.centerMapAtPosition( self.state.position );
					} );

				this.props.scope.$on( "search-map-at-address",
					function onSearchMapAtAddress( event, address, callback ){
						self.loadPositionAtAddress( address, callback );
					} );

				this.props.scope.$on( "search-map-at-position",
					function onSearchMapAtAddress( event, position, callback ){
						self.getAddressAtPosition( position, callback );
					} );
			},

			"centerMapAtPosition": function centerMapAtPosition( position ){
				this.mapPointer.setPosition( position );

				this.map.setCenter( position );
			},

			"setMapState": function setMapState( mapState ){
				this.setState( {
					"mapState": mapState
				} );
			},

			"componentWillMount": function componentWillMount( ){
				this.createGeoCoder( );

				this.attachAllComponentEventListener( );
			},

			"render": function onRender( ){
				return ( 
					<div className="crime-locate-container">
						<div className="map-container"></div>
					</div>
				);
			},

			"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
				if( !( this.map instanceof google.maps.Map ) && 
					this.state.position instanceof google.maps.LatLng )
				{
					this.initializeMap( );
				}

				if( !_.isEqual( this.state.position, prevState.position ) ){
					this.centerMapAtPosition( this.state.position );
				}

				if( this.state.mapState != prevState.mapState ){
					switch( this.state.mapState ){
						case "zen":
							this.mapPointer.setVisible( false );
							break;

						case "normal":
							this.mapPointer.setVisible( true );
							break;
					}
				}
			},

			"componentDidMount": function componentDidMount( ){
				this.loadCurrentPosition( );

				this.props.scope.$root.$broadcast( "crime-locate-rendered" );
			}
		} );

		return {
			"restrict": "EA",
			"scope": true,
			"link": function onLink( scope, element, attributeSet ){
				PageFlow( scope, element );

				scope.wholePageLeft( );

				scope.$on( "show-map",
					function onShowMap( ){
						scope.wholePageCenter( );
					} );

				scope.$on( "hide-map",
					function onHideMap( ){
						scope.wholePageLeft( );
					} );

				scope.$on( "show-zen-map",
					function onShowZenMap( ){
						scope.wholePageCenter( );
					} );

				scope.$on( "show-normal-map",
					function onShowNormalMap( ){
						scope.wholePageCenter( );
					} );

				$( window ).resize( function onResize( ){
					scope.$root.$broadcast( "update-map-view" );
				} );

				React.renderComponent( <crimeLocate scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );