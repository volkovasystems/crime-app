Crime.directive( "crimeDashbar", [
	"PageFlow",
	function directive( PageFlow ){
		var crimeDashbar = React.createClass( {
			"render": function onRender( ){
				return (
					<div className="crime-dashbar-container">
						<div className="dash-list">
							<div 
								className="dash-item row"
								onClick={ this.onClick } 
								value="home">
							</div>

							<div 
								className="dash-item row"
								onClick={ this.onClick }
								value="profile">
							</div>

							<div 
								className="dash-item row"
								onClick={ this.onClick }
								value="search">
							</div>

							<div 
								className="dash-item row"
								onClick={ this.onClick }
								value="report">
							</div>
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

				scope.$on( "show-dashbar",
					function onShowMap( ){
						scope.wholePageCenter( );
					} );

				scope.$on( "hide-dashbar",
					function onHideMap( ){
						scope.wholePageUp( );
					} );

				React.renderComponent( <crimeDashbar scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );
