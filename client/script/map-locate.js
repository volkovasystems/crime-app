angular.module( "MapLocate", [ "Event" ] )

	.constant( "DEFAULT_MAP_ADDRESS", "Manila, Philippines" )

	.factory( "createGeoCoder", [
		function factory( ){
			var createGeoCoder = function createGeoCoder( ){
				var geoCoder = new google.maps.Geocoder( );

				return geoCoder;
			};

			return createGeoCoder;
		}
	] )

	.factory( "getAddressAtPosition", [
		"createGeoCoder",
		function factory( createGeoCoder ){
			var geoCoder = createGeoCoder( );
	
			var getAddressAtPosition = function getAddressAtPosition( position, callback ){
				callback = callback || function callback( ){ };

				var self = this;

				geoCoder.geocode( { "location": position }, 
					function onGeoCodeResult( results, status ){
						if( status == google.maps.GeocoderStatus.OK ){
							var readableAddress = _.map( results[ 0 ].address_components,
								function onEachAddressComponent( addressComponent ){
									return addressComponent.long_name;
								} )
								.join( ", " );

							callback( null, readableAddress );

						}else{
							callback( new Error( "error getting address at position" ) );
						}
					} );
			};

			return getAddressAtPosition;
		}
	] )

	.factory( "getPositionAtAddress", [
		"createGeoCoder",
		function factory( createGeoCoder ){
			var geoCoder = createGeoCoder( );
			
			var getPositionAtAddress = function getPositionAtAddress( address, callback ){
				callback = callback || function callback( ){ };

				var self = this;
				
				geoCoder.geocode( { "address": address }, 
					function onGeoCodeResult( results, status ){
						if( status == google.maps.GeocoderStatus.OK ){
							callback( null, results[ 0 ].geometry.location );

						}else{
							callback( new Error( "error getting position at address" ) );
						}
					} );
			};

			return getPositionAtAddress;
		}
	] )

	.factory( "getCurrentPosition", [
		"getPositionAtAddress",
		function factory( getPositionAtAddress ){
			var getCurrentPosition = function getCurrentPosition( callback ){
				callback = callback || function callback( ){ };

				var self = this;

				if( navigator.geolocation ){
					navigator.geolocation
						.getCurrentPosition( function onCurrentPosition( position ){
							var position = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
							
							callback( null, position );				
						} );

				}else{
					getPositionAtAddress( DEFAULT_MAP_ADDRESS, callback );
				}
			};

			return getCurrentPosition;
		}
	] )

	.directive( "mapLocate", [
		"Event",
		"getAddressAtPosition",
		"getPositionAtAddress",
		"getCurrentPosition",
		function directive( 
			Event,
			getAddressAtPosition,
			getPositionAtAddress,
			getCurrentPosition
		){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "map-view-rendered",
						function onMapRendered( ){
							getCurrentPosition( function callback( error, currentPosition ){
								if( error ){
									//: @todo: Do some error handling here!
										
								}else{
									scope.mapComponent.setCenter( currentPosition );	
								}
							} );
						} );

					scope.on( "set-position-at-address",
						function onSetPositionAtAddress( address ){
							getPositionAtAddress( address,
								function callback( error, position ){
									if( error ){
										//: @todo: Do some error handling here!
										
									}else{
										scope.mapComponent.setCenter( position );
									}
								} );
						} );

					scope.on( "get-current-position",
						function getCurrentPosition( callback ){
							callback( null, scope.mapComponent.getCenter( ) );
						} );

					scope.on( "get-current-address",
						function getCurrentAddress( callback ){
							getAddressAtPosition( scope.mapComponent.getCenter( ), callback );
						} );
				}
			};
		}
	] );