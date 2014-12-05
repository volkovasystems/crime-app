angular.module( "Search", [ "Event", "PageFlow" ] )

	.constant( "SEARCH_PLACEHOLDER", labelData.SEARCH_PLACEHOLDER )

	.factory( "Search", [
		"SEARCH_PLACEHOLDER",
		function factory( 
			SEARCH_PLACEHOLDER
		){
			var Search = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						React.render( <Search scope={ scope } />, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"searchText": "",
						"searchState": "search-empty"
					};
				},

				"changeSearchState": function changeSearchState( ){
					var searchText = this.state.searchText;
					if( _.isEmpty( searchText ) ){
						this.setState( {
							"searchState": "search-empty"
						} );

					}else{
						this.setState( {
							"searchState": "search-filled"
						} );
					}
				},

				"onClickSearch": function onClickSearch( ){
					if( this.timeout ){
						clearTimeout( this.timeout );

						this.timeout = null;
					}

					this.scope.publish( "search-text-changed", this.state.searchText );
				},

				"onChangeSearchText": function onChangeSearchText( event ){
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
					}, 5000 );

					this.setState( {
						"searchText": searchText,
						"searchState": "search-filled"
					} );
				},

				"onClickClearSearch": function onClearSearchClick( event ){
					if( this.state.searchState != "search-empty" ){
						this.setState( {
							"searchText": "",
							"searchState": "search-empty"
						} );
					}
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "set-search-text",
						function onSetSearchText( searchText ){
							self.setState( {
								"searchText": searchText
							} );
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					var searchText = this.state.searchText;
					
					var searchState = this.state.searchState;
					
					return; //: @template: template/search.html
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					if( prevState.searchText != this.state.searchText ){
						this.changeSearchState( );
					}
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.publish( "search-rendered" );	
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
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "search overflow" );

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