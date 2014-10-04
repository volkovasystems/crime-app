Crime.directive( "crimeSearch", [
	"PageFlow",
	function directive( PageFlow ){
		var crimeSearch = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"address": "",
					"searchAddress": "",
					"confirmState": "",
					"confirmPrompt": ""
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

			},

			"componentWillMount": function componentWillMount( ){
			},

			"render": function onRender( ){
				return ( 
					<div className="crime-search-container">
						<div className="address-search-container">
							<input 
								className="address-search-input form-control" 
								type="text"
								value={ this.state.address }
								onChange={ this.onChange }
								onKeyPress={ this.onKeyPress }/>
						</div>

						<div className="confirm-address-container">
							<button
								className="confirm-address-button btn btn-lg btn-primary"
								type="button"
								onClick={ this.onClick }>

								{ this.state.confirmPrompt.toUpperCase( ) }

							</button>
						</div>
					</div>
				);
			},

			"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
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
						scope.wholePageCenter( );
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