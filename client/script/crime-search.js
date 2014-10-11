Crime.directive( "crimeSearch", [
	"PageFlow",
	function directive( PageFlow ){
		var crimeSearch = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"address": "",
					"searchAddress": "",
					"searchTimeout": null,
					"confirmState": "standby",
					"confirmPrompt": "confirm",
					"searchPosition": null,
					"readableAddress": ""
				};
			},

			"onKeyPress": function onKeyPress( event ){
				if( event.key == "Enter" ){
					this.setState( {
						"searchAddress": event.target.value
					} );
				}
			},

			"onChange": function onChange( event ){
				this.setState( {
					"address": event.target.value
				} );
			},

			"onClick": function onClick( event ){
				if( this.state.searchPosition instanceof google.maps.LatLng ){
					this.props.scope.$root.$broadcast( "hide-map-search" );
					this.props.scope.$root.$broadcast( "show-zen-map" );
					this.props.scope.$root.$broadcast( "show-reporting" );
					this.props.scope.$root.$broadcast( "confirmed-map-data", this.state.searchPosition );
				}
			},

			"componentWillMount": function componentWillMount( ){
				var self = this;

				this.props.scope.$on( "final-position-changed",
					function onFinalPositionChanged( event, finalPosition ){
						self.setState( {
							"searchPosition": finalPosition
						} );

						self.props.scope.$root.$broadcast( "search-map-at-position",
							finalPosition,
							function onSearchMapAtPosition( error, readableAddress ){
								self.setState( {
									"readableAddress": readableAddress
								} );
							} );
					} );
			},

			"render": function onRender( ){
				var readableAddress = this.state.readableAddress || "";
				var latitude = "";
				var longitude = "";
				if( this.state.searchPosition instanceof google.maps.LatLng ){
					latitude = this.state.searchPosition.lat( );
					longitude = this.state.searchPosition.lng( );

					var formatOption = { "notation": "fixed", "precision": 4 };
					latitude = math.format( latitude, formatOption );
					longitude = math.format( longitude, formatOption );
				}

				return ( 
					<div className="crime-search-container">
						<div 
							className={ [
								"address-search-container",
								"input-group",
								"container",
								"row",
								"col-xs-10",
								"col-xs-offset-1",
								"col-sm-10",
								"col-sm-offset-1",
								"col-md-8",
								"col-md-offset-2",
								"col-lg-8",
								"col-lg-offset-2"
							].join( " " ) }>

							<p className="location-description bg-info text-center">
								You are currently pointing to { readableAddress }<br />
								( { latitude + "\u00b0" }, { longitude + "\u00b0" } )
							</p>

							<div className="input-group">
								<input 
									className="address-search-input form-control input-lg text-center" 
									type="text"
									placeholder="Search for location of crime."
									value={ this.state.address }
									onChange={ this.onChange }
									onKeyPress={ this.onKeyPress }/>

								<span className="input-group-btn">
									<button
										className={ [
											"confirm-address-button",
											"btn",
											"btn-lg",
											( this.state.confirmState == "standby" )? "btn-default": "",
											( this.state.confirmState == "ready" )? "btn-primary": ""
										].join( " " ) }
										type="button"
										onClick={ this.onClick }>

										{ this.state.confirmPrompt.toUpperCase( ) }

									</button>
								</span>
							</div>
						</div>
					</div>
				);
			},

			"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
				var self = this;

				if( this.state.address != prevState.address ){
					this.setState( {
						"confirmState": "standby"
					} );

					if( this.state.searchTimeout ){
						clearTimeout( this.state.searchTimeout );

						this.state.searchTimeout = null;
					}

					this.state.searchTimeout = setTimeout( function onTimeout( ){
						self.props.scope.$root.$broadcast( "search-map-at-address", 
							self.state.address,
							function callback( error, position ){
								if( error ){

								}else{
									self.setState( {
										"searchPosition": position
									} );
								}

								clearTimeout( self.state.searchTimeout );

								self.state.searchTimeout = null;
							} );
					}, 3000 );

				}else if( !_.isEqual( this.state.searchPosition, prevState.searchPosition ) ){
					this.setState( {
						"confirmState": "ready"
					} );
				}
			},

			"componentDidMount": function componentDidMount( ){
				this.props.scope.$root.$broadcast( "crime-search-rendered" );	
			}
		} );

		return {
			"restrict": "EA",
			"scope": true,
			"link": function onLink( scope, element, attributeSet ){
				PageFlow( scope, element );

				scope.wholePageUp( );

				scope.$on( "show-map-search",
					function onShowMap( ){
						scope.clearFlow( );
						scope.applyFlow( "search-footer" );
					} );

				scope.$on( "hide-map-search",
					function onHideMap( ){
						scope.wholePageUp( );
					} );

				React.renderComponent( <crimeSearch scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );