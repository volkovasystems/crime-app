angular.module( "MapLocate", [ "Event" ] )

	.constant( "DEFAULT_MAP_ADDRESS", "Manila, Philippines" )

	.directive( "mapLocate", [
		"Event",
		"DEFAULT_MAP_ADDRESS",
		function directive( Event, DEFAULT_MAP_ADDRESS ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "map-view-state-changed",
						function onMapStateChanged( prevProps, prevState ){
							scope.emit( "access-map-internal-environment",
								function mapInternalEnvironment( ){
									if( prevState.position != this.state.position ){
										this.centerMapAtPosition( this.state.position );
									}
								} );
						} );

					//: @todo: I don't like this, but when the when( ) method of Event is implemented we can simplify this.
					scope.on( "map-view-rendered",
						function onMapRendered( ){
							scope.emit( "access-map-internal-environment",
								function mapInternalEnvironment( ){
									var self = this;

									this.createGeoCoder = function createGeoCoder( ){
										if( "geoCoder" in this &&
											this.geoCoder &&
											this.geoCoder instanceof google.maps.Geocoder )
										{
											return this.geoCoder;
										}

										var geoCoder = new google.maps.Geocoder( );

										this.geoCoder = geoCoder;

										return geoCoder;
									};

									this.getAddressAtPosition = function getAddressAtPosition( position, callback ){
										var self = this;

										this.geoCoder.geocode( { "location": position }, 
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
													self.scope.broadcast( "error", "locate-error", status, results );
												}
											} );
									};

									this.getPositionAtAddress = function getPositionAtAddress( address, callback ){
										var self = this;
										
										this.geoCoder.geocode( { "address": address }, 
											function onGeoCodeResult( results, status ){
												if( status == google.maps.GeocoderStatus.OK ){
													if( typeof callback == "function" ){
														callback( null, results[ 0 ].geometry.location );
													}

												}else{
													self.scope.broadcast( "error", "locate-error", status, results );
												}
											} );
									};

									this.setPosition = function setPosition( position ){
										this.setState( {
											"position": position
										} );
									};

									this.loadCurrentPosition = function loadCurrentPosition( ){
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
									};

									this.centerMapAtPosition = function centerMapAtPosition( position ){
										this.mapComponent.setCenter( position );
									};

									this.attachAllLocateComponentEventListener = function attachAllLocateComponentEventListener( ){
										this.scope.on( "search-map-at-address",
											function onSearchMapAtAddress( event, address, callback ){
												self.getPositionAtAddress( address, callback );
											} );

										this.scope.on( "search-map-at-position",
											function onSearchMapAtAddress( event, position, callback ){
												self.getAddressAtPosition( position, callback );
											} );

										this.scope.on( "set-map-position",
											function onSetMapPosition( event, position ){
												self.setPosition( position );
											} );
									};

									this.createGeoCoder( );

									this.attachAllLocateComponentEventListener( );

									this.loadCurrentPosition( );
								} );
						} );
				}
			};
		}
	] );