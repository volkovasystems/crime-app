Crime.directive( "crimeHome", [
	"PageFlow",
	function directive( PageFlow ){
		var crimeHome = React.createClass( {
			"render": function onRender( ){
				return (
					<div className="crime-home-container">
						<div 
							className={ [
								"crime-home-logo",
								"container",
								"row",
								"col-xs-6",
								"col-xs-offset-3",
								"col-sm-6",
								"col-sm-offset-3",
								"col-md-2",
								"col-md-offset-5",
								"col-lg-2",
								"col-lg-offset-5"
							].join( " " ) }>
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

				scope.defaultPage( );

				scope.$on( "show-default-page",
					function onShowDefaultPage( ){
						scope.defaultPage( );
					} );

				scope.$on( "show-home",
					function onShowMap( ){
						scope.wholePageCenter( );
					} );

				scope.$on( "hide-home",
					function onHideMap( ){
						scope.wholePageUp( );
					} );

				React.renderComponent( <crimeHome scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );
