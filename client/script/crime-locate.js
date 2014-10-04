Crime.directive( "crimeLocate", [
	"PageFlow",
	function directive( PageFlow ){
		var geoCoder = new google.maps.Geocoder( );

		var crimeLocate = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"map": { },
					"mapPointer": { },
					"mapZoom": 15,
					"mapOptionSet": { },
					"position": { },
					"finalPosition": { },
					"mapState": "normal"
				};
			},

			"initializeMap": function initializeMap( ){
				var self = this;

				if( !( this.state.position instanceof google.maps.LatLng ) ){
					this.loadCurrentPosition( );

				}else if( !( this.state.map instanceof google.maps.Map ) ){
					var mapContainer = $( ".map-container", this.getDOMNode( ) )[ 0 ];

					var map = new google.maps.Map( mapContainer, {
						"zoom": this.state.mapZoom,
						"minZoom": this.state.mapZoom,
						"maxZoom": this.state.mapZoom + 5,
						"center": this.state.finalPosition,
						"mapTypeControl": false,
						"overviewMapControl": false,
						"panControl": false,
						"streetViewControl": false,
						"scaleControl": true
					} );

					var mapPointer = new google.maps.Marker( {
						"map": map,
						"draggable": true,
						"position": this.state.finalPosition
					} );

					google.maps.event.addListener( mapPointer, "dragstart",
						function onDragStart( event ){
							self.setState( {
								"position": event.latlng
							} );
						} );

					google.maps.event.addListener( mapPointer, "drag",
						function onDrag( event ){
							self.setState( {
								"position": event.latlng
							} );
						} );

					google.maps.event.addListener( mapPointer, "dragend",
						function onDragEnd( event ){
							self.setState( {
								"position": event.latlng
							} );
						} );

					google.maps.event.addListener( mapPointer, "mouseup",
						function onDragEnd( event ){
							self.setState( {
								"finalPosition": event.latlng
							} );
						} );

					google.maps.event.addListener( map, "tilesloaded",
						function onTilesLoaded( event ){
							self.props.scope.$root.$broadcast( "map-loaded" );
						} );					

					this.setState( {
						"map": map,
						"mapPointer": mapPointer
					} );

					this.props.scope.$root.$broadcast( "map-data", {
						"map": map,
						"mapPointer": mapPointer,
						"geoCoder": geoCoder
					} );
				}
			},

			"loadPositionAtAddress": function loadPositionAtAddress( address ){
				var self = this;
				geoCoder.geocode( { "address": address }, 
					function onGeoCodeResult( results, status ){
						if( status == google.maps.GeocoderStatus.OK ){
							self.setState( {
								"position": results[ 0 ].geometry.location,
								"finalPosition": results[ 0 ].geometry.location
							} );
						}
					} );
			},

			"loadCurrentPosition": function loadCurrentPosition( ){
				var self = this;
				if( navigator.geolocation ){
					navigator.geolocation
						.getCurrentPosition( function onCurrentPosition( position ){
							var position = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
							
							self.setState( {
								"position": position,
								"finalPosition": position
							} );
						} );

				}else{
					//Always point to Manila, Philippines.
					this.loadPositionAtAddress( "Manila, Philippines" );
				}
			},

			"componentWillMount": function componentWillMount( ){
				var self = this;
				$( window ).resize( function onResize( ){
					self.loadCurrentPosition( );

					if( self.state.mapState == "zen-mode" ){
						self.props.scope.$root.$broadcast( "set-zen-mode" );
					}
				} );

				this.props.scope.$on( "disable-default-map-control-set",
					function onDisableDefaultMapControlSet( ){
						if( self.state.map instanceof google.maps.Map ){
							self.state.map.setOptions( {
								"disableDefaultUI": true
							} );
						}
					} );

				this.props.scope.$on( "enable-default-map-control-set",
					function onDisableDefaultMapControlSet( ){
						if( self.state.map instanceof google.maps.Map ){
							self.state.map.setOptions( {
								"disableDefaultUI": false
							} );
						}
					} );

				this.props.scope.$on( "hide-map-pointer",
					function onHideMapPointer( ){
						if( self.state.mapPointer instanceof google.maps.Marker ){
							self.state.mapPointer.setVisible( false );
						}
					} );

				this.props.scope.$on( "show-map-pointer",
					function onShowMapPointer( ){
						if( self.state.mapPointer instanceof google.maps.Marker ){
							self.state.mapPointer.setVisible( true );
						}
					} );

				this.props.scope.$on( "show-zen-map",
					function onShowZenMap( ){
						self.setState( {
							"mapState": "zen-mode"
						} );
					} );

				this.props.scope.$on( "show-normal-map",
					function onShowNormalMap( ){
						self.setState( {
							"mapState": "normal"
						} );
					} );
			},

			"render": function onRender( ){
				return ( 
					<div className="crime-locate-container">
						<div className="map-container"></div>
					</div>
				);
			},

			"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
				if( !( this.state.position instanceof google.maps.LatLng ) ){
					this.loadCurrentPosition( );

				}else if( !( this.state.map instanceof google.maps.Map ) && 
					this.state.position instanceof google.maps.LatLng )
				{
					this.initializeMap( );

				}else if( this.state.searchAddress != prevState.searchAddress ){
					this.loadPositionAtAddress( this.state.searchAddress );
				}

				if( this.state.map instanceof google.maps.Map && 
					this.state.finalPosition instanceof google.maps.LatLng )
				{
					this.state.map.setCenter( this.state.finalPosition );
					this.state.mapPointer.setPosition( this.state.finalPosition );				
				}
				
				if( this.state.map instanceof google.maps.Map && 
					this.state.position instanceof google.maps.LatLng &&
					!_.isEqual( this.state.position, prevState.position ) )
				{
					this.state.mapPointer.setPosition( this.state.position );
				
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

				scope.wholePageUp( );

				scope.$on( "show-map",
					function onShowMap( ){
						scope.wholePageCenter( );
					} );

				scope.$on( "hide-map",
					function onHideMap( ){
						scope.wholePageUp( );
					} );

				scope.$on( "show-zen-map",
					function onShowZenMap( ){
						scope.$root.$broadcast( "set-zen-mode" );
						scope.wholePageCenter( );
					} );

				scope.$on( "show-normal-map",
					function onShowNormalMap( ){
						scope.$root.$broadcast( "set-normal-mode" );
						scope.wholePageCenter( );
					} );

				scope.$on( "set-zen-mode",
					function onSetZenMode( ){
						scope.$root.$broadcast( "disable-default-map-control-set" );
						scope.$root.$broadcast( "hide-map-pointer" );
					} );

				scope.$on( "set-normal-mode",
					function onSetNormalMode( ){
						scope.$root.$broadcast( "enable-default-map-control-set" );
						scope.$root.$broadcast( "show-map-pointer" );
					} );

				React.renderComponent( <crimeLocate scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );