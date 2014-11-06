angular.module( "Search", [ "Event", "PageFlow", "Icon" ] )

	.value( "SEARCH_ADDRESS", "search address" )

	.factory( "Search", [
		"Icon",
		"SEARCH_ADDRESS"
		function factory( Icon, SEARCH_ADDRESS ){
			var Search = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						React.renderComponent( <Search scope={ scope } />, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"searchText": "",
						"searchState": "search-empty",
						"componentState": "search-normal"
					};
				},

				"onSearchTextChange": function onSearchTextChange( event ){
					var searchText = event.target.value;

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
						"searchText": address,
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
					this.scope = this.props.scope;
				},

				"render": function onRender( ){
					var searchText = this.state.searchText;
					
					var searchState = this.state.searchState;
					
					return ( 
						<div className="search-container">
							<div 
								className={ [
									"search-component"
								].join( " " ) }>

								<div
									className={ [
										"search-icon",
									].join( " " ) }>
									<Icon name="ic_search_24px" />
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
										<Icon
											className={ [
												"clear-search-icon"
											].join( " " ) }
											name="ic_clear_24px" />
									</div>
								</div>
							</div>
						</div>
					);
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.broadcast( "search-rendered" );	
				}
			} );	
		}
	] )

Crime.directive( "search", [
	"PageFlow",
	"Event",
	"Search",
	function directive( PageFlow, Event, Search ){
		return {
			"restrict": "EA",
			"scope": true,
			"link": function onLink( scope, element, attributeSet ){
				Event( scope );

				PageFlow( scope, element, "search" );

				scope.on( "show-search",
					function onShowSearch( ){
						scope.showPage( );
					} );

				scope.on( "hide-search",
					function onHideSearch( ){
						scope.hidePage( );
					} );

				scope.publish( "hide-search" );

				Search.attach( scope, element );
			}
		};
	}
] );