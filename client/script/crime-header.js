Crime.directive( "crimeHeader", [
	"PageFlow",
	function directive( PageFlow ){
		var crimeHeader = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"componentState": "header-standby"
				};
			},

			"componentWillMount": function componentWillMount( ){
			},

			"render": function onRender( ){
				var componentState = this.state.componentState;

				return ( 
					<div 
						className={ [
							"crime-header-container",
							componentState
						].join( " " ) }>
					</div>
				);
			},

			"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
			},

			"componentDidMount": function componentDidMount( ){
				this.props.scope.$root.$broadcast( "crime-header-rendered" );	
			}
		} );

		return {
			"restrict": "EA",
			"scope": true,
			"link": function onLink( scope, element, attributeSet ){
				PageFlow( scope, element, "header" );

				scope.reflow( "hidden", "header-standby" );

				scope.$on( "show-default-page",
					function onShowDefaultPage( ){
						scope.$root.$broadcast( "show-normal-header" );
					} );

				scope.$on( "show-normal-header",
					function onShowNormalHeader( ){
						scope.reflow( "shown", "header-standby" );
					} );

				scope.$on( "show-expanded-header",
					function onShowExpandedHeader( ){
						scope.reflow( "shown", "header-expanded" );
					} );

				scope.$on( "show-header",
					function onShowMap( ){
						scope.applyFlow( "shown" );
					} );

				scope.$on( "hide-header",
					function onHideMap( ){
						scope.applyFlow( "hidden" );
					} );

				React.renderComponent( <crimeHeader scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );