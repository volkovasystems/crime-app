angular.module( "MapPreview", [ "MapView" ] )

	.factory( "getGoogleAPIKey", [
		function factory( ){
			var getGoogleAPIKey = function getGoogleAPIKey( ){
				//: @todo: Throw a fatal error if there's no google api key for maps.
				return window.GOOGLE_API_KEY;
			};

			return getGoogleAPIKey;
		}
	] )

	.factory( "MapPreview", [
		"getGoogleAPIKey",
		"DEFAULT_POSITION",
		"DEFAULT_MAP_ZOOM",
		function factory( getGoogleAPIKey, DEFAULT_POSITION, DEFAULT_MAP_ZOOM ){
			var MapPreview = React.createClass( {
				statics: {
					"constructStaticMapURL": function constructStaticMapURL( position, zoom ){
						var latitude = position.lat( );
						var longitude = position.lng( );

						return [
							"https://maps.googleapis.com/maps/api/staticmap?",
							
							[ "center", 
								[ latitude, longitude ].join( "," ) 
							].join( "=" ),

							[ "zoom", zoom ].join( "=" ),

							[ "size", [ 500, 400 ].join( "x" ) ].join( "=" ),

							[ "markers", 
								[
									[ "color", "red" ].join( ":" ),
									[ latitude, longitude ].join( "," ) 
								].join( "%7C" )
							].join( "=" ),

							[ "key", getGoogleAPIKey( ) ].join( "=" )
						].join( "&" );
					},
				},

				"getInitialState": function getInitialState( ){
					return {
						"staticMapURL": ""
					};
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"title": "",
						"position": DEFAULT_POSITION,
						"zoom": DEFAULT_MAP_ZOOM,
						"address": "",
						"parent": null,
						"staticMapURL": "#"
					};
				},

				"getStaticMapURL": function getStaticMapURL( ){
					return this.state.staticMapURL || this.props.staticMapURL;
				},

				"updateStaticMapImage": function updateStaticMapImage( ){
					var position = this.props.position || DEFAULT_POSITION;

					var zoom = this.props.zoom || DEFAULT_MAP_ZOOM;

					var staticMapURL = MapPreview.constructStaticMapURL( position, zoom );

					this.setState( {
						"staticMapURL": staticMapURL
					} );
				},

				"render": function onRender( ){
					var title = this.props.title;

					var address = this.props.address;

					var position = this.props.position || DEFAULT_POSITION;

					var staticMapURL = this.getStaticMapURL( );

					var latitude = position.lat( );
					var longitude = position.lng( );

					var formatOption = { "notation": "fixed", "precision": 4 };
					latitude = math.format( latitude, formatOption );
					longitude = math.format( longitude, formatOption );

					return (
						<div 
							className={ [
								"map-preview-component"
							].join( " " ) } >

							<label 
								style={
									{
										"display": ( _.isEmpty( title )? "none" : "block" ),
										"width": "inherit"
									}
								}>
								{ title.toUpperCase( ) }
							</label>

							<div
								className={ [
									"map-image"
								].join( " " ) }
								style={
									{
										"width": "100%",
										"height": "250px",
										"backgroundImage": "url( \"@mapURL\" )".replace( "@mapURL", staticMapURL ),
										"backgroundPosition": "center center",
										"backgroundSize": "100%",
										"backgroundRepeat": "no-repeat"
									}
								}>
							</div>

							<p 
								className={ [ 
									"map-address",
									"information",
									"main-heading"
								].join( " " ) }
								style={
									{
										"marginTop": "5px"
									}
								}>
								{ address }
							</p>

							<p
								className={ [
									"map-location",
									"information",
									"sub-heading"
								].join( " " ) }>
								( { latitude + "\u00b0" }, { longitude + "\u00b0" } )
							</p>
						</div>
					);
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					if( prevState.staticMapURL != this.state.staticMapURL ||
						prevProps.staticMapURL != this.props.staticMapURL )
					{
						this.props.parent.setState( {
							"staticMapURL": this.getStaticMapURL( )
						} );
					}

					if( !_.isEqual( prevProps.position, this.props.position ) ){
						this.updateStaticMapImage( );
					}
				},

				"componentDidMount": function componentDidMount( ){
					this.updateStaticMapImage( );
				}
			} );

			return MapPreview;		
		}
	] );