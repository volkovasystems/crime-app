Crime.directive( "crimeDashbar", [
	"PageFlow",
	function directive( PageFlow ){
		var crimeDashbar = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"dashList": [ 
						"home",
						"locate",
						"profile"
					],
					"dashbarState": "minified"
				};
			},

			"onDashbarItemClick": function onDashbarItemClick( event ){

			},

			"onMinifiedButtonClick": function onMinifiedButtonClick( ){

			},

			"onEachDashItem": function onEachDashItem( dashItem, index ){
				var key = [ dashItem, index ].join( ":" );

				return (
					<div 
						key={ key }
						className={
							[
								"dash-item",
								"row",
								[ "dashbar", this.state.dashbarState ].join( "-" )
							].join( " " )
						}
						onClick={ this.onDashbarItemClick } 
						value={ dashItem }>
						<span className={
							[
								"glyphicon",
								( dashItem == "home" )? "glyphicon-home" : "",
								( dashItem == "locate" )? "glyphicon-map-marker" : "",
								( dashItem == "account" )? "glyphicon-user": ""
							].join( " " )
						}></span>
						{ dashItem.toUpperCase( ) }
					</div>
				);
			},

			"componentWillMount": function componentWillMount( ){
				var self = this;

				this.props.scope.$on( "show-default-page",
					function onShowDefaultPage( ){
						self.setState( {
							"dashbarState": "minified"
						} );
					} );

				this.props.scope.$on( "show-iconified-dashbar",
					function onShowIconifiedDashbar( ){
						self.setState( {
							"dashbarState": "iconified"
						} );
					} );

				this.props.scope.$on( "show-listed-dashbar",
					function onShowListedDashbar( ){
						self.setState( {
							"dashbarState": "listed"
						} );
					} );
				
			},

			"render": function onRender( ){

				return (
					<div 
						className={
							[
								"crime-dashbar-container",
								[ "dashbar", this.state.dashbarState ].join( "-" )
							].join( " " )
						}>
						<button 
							className={
								[
									"dashbar-minified-button",
									[ "dashbar", this.state.dashbarState ].join( "-" )
								].join( " " )
							}
							onClick={ this.onMinifiedButtonClick }>
							<span className={
								[
									"dashbar-minified-icon",
									"glyphicon",
									"glyphicon-th"
								].join( " " )
							}></span>
						</button>
						<div 
							className={
								[
									"dash-list",
									[ "dashbar", this.state.dashbarState ].join( "-" )
								].join( " " )
							}>
							{ this.state.dashList.map( this.onEachDashItem ) }
						</div>
					</div>
				);
			},

			"componentDidMount": function componentDidMount( ){
				this.props.scope.$root.$broadcast( "crime-dashbar-rendered" );	
			}
		} );

		return {
			"restrict": "EA",
			"scope": true,
			"link": function onLink( scope, element, attributeSet ){
				PageFlow( scope, element );

				scope.$on( "show-iconified-dashbar",
					function onShowIconifiedDashbar( ){
						scope.defaultPage( );
					} );

				scope.$on( "show-listed-dashbar",
					function onShowListedDashbar( ){
						scope.defaultPage( );
					} );

				scope.$on( "show-default-page",
					function onShowDefaultPage( ){
						scope.defaultPage( );
					} );

				scope.$on( "show-dashbar",
					function onShowMap( ){
						scope.defaultPage( );
					} );

				scope.$on( "hide-dashbar",
					function onHideMap( ){
						scope.wholePageLeft( );
					} );

				React.renderComponent( <crimeDashbar scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );
