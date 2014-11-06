angular.module( "Search", [ "Event", "PageFlow", "Icon" ] )

	.value( "SEARCH_PROMPT", "search something" )

	.factory( "Search", [
		"Icon",
		"SEARCH_PROMPT",
		function factory( Icon, SEARCH_PROMPT ){
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

					if( this.timeout ){
						clearTimeout( this.timeout );
						
						this.timeout = null;
					}

					if( _.isEmpty( searchText ) ){
						this.setState( {
							"searchText": "",
							"searchState": "search-empty"
						} );

						return;
					}

					var self = this;
					this.timeout = setTimeout( function onTimeout( ){
						self.scope.publish( "search-text-changed", self.state.searchText );

						clearTimeout( self.timeout );

						self.timeout = null;
					}, 1000 );

					this.setState( {
						"searchText": searchText,
						"searchState": "search-filled"
					} );
				},

				"onClearSearchClick": function onClearSearchClick( event ){
					if( this.state.searchState != "search-empty" ){
						this.setState( {
							"searchText": "",
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
						<div 
							className={ [
								"search-container"
							].join( " " ) }>
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
										placeholder={ SEARCH_PROMPT.toUpperCase( ) }
										value={ searchText }
										onChange={ this.onSearchTextChange } />

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

			return Search;
		}
	] )

	.directive( "search", [
		"PageFlow",
		"Event",
		"Search",
		function directive( PageFlow, Event, Search ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 2,
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