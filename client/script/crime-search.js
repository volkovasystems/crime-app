Crime.directive( "crimeSearch", [
	"PageFlow",
	function directive( PageFlow ){
		var SEARCH_ADDRESS = "search address";

		var crimeSearch = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"searchAddress": "",
					"position": null,
					"searchState": "search-empty"
				};
			},

			"searchAddress": function searchAddress( address ){
				var self = this;

				async.waterfall( 
					[
						function searchMapAtAddress( callback ){
							self.props.scope.$root.$broadcast( "search-map-at-address", address,
								function onResult( error, position ){
									callback( null, position );

									self.setState( {
										"position": position
									} );
								} );	
						},

						function searchMapAtPosition( position, callback ){
							self.props.scope.$root.$broadcast( "search-map-at-position", position,
								function onResult( error, readableAddress ){
									callback( null, position, readableAddress );

									self.setState( {
										"searchAddress": readableAddress
									} );
								} );	
						}
					],
					function lastly( error, position, readableAddress ){
						self.setState( {
							"searchState": "search-done"
						} );
					} );
			},

			"moveMapToPosition": function moveMapToPosition( position ){
				this.props.scope.$root.$broadcast( "set-map-position", position );
			},

			"onSearchAddressChange": function onSearchAddressChange( event ){
				var address = event.target.value;

				if( this.timeoutChange ){
					clearTimeout( this.timeoutChange );
					this.timeoutChange = null;
				}

				if( _.isEmpty( address ) ){
					this.setState( {
						"searchAddress": address,
						"searchState": "search-empty"
					} );

					return;
				}

				var self = this;
				this.timeoutChange = setTimeout( function onTimeout( ){
					self.searchAddress( address );

					clearTimeout( self.timeoutChange );
					self.timeoutChange = null;
				}, 1000 );

				this.setState( {
					"searchAddress": address,
					"searchState": "search-filled"
				} );
			},

			"onClearSearchClick": function onClearSearchClick( event ){
				if( this.state.searchState != "search-empty" ){
					this.setState( {
						"searchAddress": "",
						"searchState": "search-empty"
					} );
				}
			},

			"componentWillMount": function componentWillMount( ){
				
			},

			"render": function onRender( ){
				var searchAddress = this.state.searchAddress;
				var searchState = this.state.searchState;
				
				return ( 
					<div className="crime-search-container">
						<div 
							className={ [
								"search-address-container"
							].join( " " ) }>

							<div
								className={ [
									"search-icon",
								].join( " " ) }>
								<icon
									name="ic_search_24px"
									src="../library/svg-sprite-action.svg" />
							</div>

							<div
								className={ [
									"search-input-container"
								].join( " " ) }>
								<input 
									type="text" 
									className={ [
										"search-input"
									].join( " " ) }
									placeholder={ SEARCH_ADDRESS.toUpperCase( ) }
									value={ searchAddress }
									onChange={ this.onSearchAddressChange } />

								<div
									className={ [
										"clear-search",
										searchState
									].join( " " ) }
									onClick={ this.onClearSearchClick }>
									<icon
										className={ [
											"clear-search-icon"
										].join( " " ) }
										name="ic_clear_24px"
										src="../library/svg-sprite-content.svg" />
								</div>
							</div>
							
						</div>
					</div>
				);
			},

			"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
				if( !_.isEqual( prevState.position, this.state.position ) ){
					this.moveMapToPosition( this.state.position );
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
				PageFlow( scope, element, "search" );

				scope.$broadcast( "hide-search" );

				scope.$on( "show-search",
					function onShowSearch( ){
						scope.toggleFlow( "!hidden", "shown" );
					} );

				scope.$on( "hide-search",
					function onHideSearch( ){
						scope.toggleFlow( "!shown", "hidden" );
					} );

				React.renderComponent( <crimeSearch scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );