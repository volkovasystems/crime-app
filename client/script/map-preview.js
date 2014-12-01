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
					"constructStaticMapURL": function constructStaticMapURL( position, zoom, pinIconURL, width, height ){
						var latitude = position.lat( );
						var longitude = position.lng( );

						return [
							"https://maps.googleapis.com/maps/api/staticmap?",
							
							[ "center", 
								[ latitude, longitude ].join( "," ) 
							].join( "=" ),

							[ "zoom", zoom ].join( "=" ),

							[ "size", [ width || 500, height || 400 ].join( "x" ) ].join( "=" ),

							[ "markers", 
								[ "icon", pinIconURL ].join( ":" )
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
						"position": DEFAULT_POSITION,
						"zoom": DEFAULT_MAP_ZOOM,
						"pinIconURL": "#",
						"staticMapURL": "#",
						"height": 400,
						"width": 500
					};
				},

				"getStaticMapURL": function getStaticMapURL( ){
					return this.state.staticMapURL || this.props.staticMapURL;
				},

				"updateStaticMapImage": function updateStaticMapImage( ){
					var position = this.props.position || DEFAULT_POSITION;

					var zoom = this.props.zoom || DEFAULT_MAP_ZOOM;

					var pinIconURL = this.props.pinIconURL || "#";

					var width = this.props.width;

					var height = this.props.height;

					var staticMapURL = MapPreview.constructStaticMapURL( position, zoom, pinIconURL, width, height );

					this.setState( {
						"staticMapURL": staticMapURL
					} );
				},

				"render": function onRender( ){
					var staticMapURL = this.getStaticMapURL( );

					return; //: @template: template/map-preview.html
				},

				"componentDidMount": function componentDidMount( ){
					this.updateStaticMapImage( );
				}
			} );

			return MapPreview;		
		}
	] );