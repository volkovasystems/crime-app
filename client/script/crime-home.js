Crime.directive( "crimeHome", [
	"PageFlow",
	function directive( PageFlow ){
		var crimeHome = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"componentState": "normal"
				};
			},

			"attachAllComponentEventListener": function attachAllComponentEventListener( ){
				var self = this;
				this.props.scope.$on( "show-login",
					function onShowLogin( ){
						self.setState( {
							"componentState": "login-component-shown"
						} );
					} );
			},

			"componentWillMount": function componentWillMount( ){
				this.attachAllComponentEventListener( );
			},

			"render": function onRender( ){
				return (
					<div className="crime-home-container">
						<div 
							className={ [
								"home-logo-component",
								"container",
								"row",
								"col-xs-6",
								"col-xs-offset-3",
								"col-sm-4",
								"col-sm-offset-4",
								"col-md-4",
								"col-md-offset-4",
								"col-lg-2",
								"col-lg-offset-5",
								this.state.componentState
							].join( " " ) }>
							<img
								className="logo" 
								src="../image/detective.png" />
						</div>
					</div>
				);
			},

			"componentDidMount": function componentDidMount( ){
				this.props.scope.$root.$broadcast( "crime-home-rendered" );	
			}
		} );

		return {
			"restrict": "EA",
			"scope": true,
			"link": function onLink( scope, element, attributeSet ){
				PageFlow( scope, element );

				scope.wholePageLeft( );

				scope.$on( "show-default-page",
					function onShowDefaultPage( ){
						scope.$root.$broadcast( "show-home" );
					} );

				scope.$on( "hide-default-page",
					function onShowDefaultPage( ){
						scope.$root.$broadcast( "hide-home" );
					} );

				scope.$on( "show-login",
					function onShowMap( ){
						scope.wholePageLeft( );
						scope.wholePageCenter( );
					} );

				scope.$on( "show-home",
					function onShowMap( ){
						scope.wholePageLeft( );
						scope.wholePageCenter( );
					} );

				scope.$on( "hide-home",
					function onHideMap( ){
						scope.wholePageRight( );
					} );

				React.renderComponent( <crimeHome scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );
