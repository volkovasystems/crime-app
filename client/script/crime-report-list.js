Crime.directive( "crimeReportList", [
	"PageFlow",
	function directive( PageFlow ){
		var crimeAccount = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"componentState": "report-list-standby"
				};
			},

			"componentWillMount": function componentWillMount( ){
			},

			"render": function onRender( ){
				var componentState = this.state.componentState;

				return ( 
					<div 
						className={ [
							"crime-report-list-container",
							componentState
						].join( " " ) }>

					</div>
				);
			},

			"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
			},

			"componentDidMount": function componentDidMount( ){
				this.props.scope.$root.$broadcast( "crime-report-list-rendered" );	
			}
		} );

		return {
			"restrict": "EA",
			"scope": true,
			"link": function onLink( scope, element, attributeSet ){
				PageFlow( scope, element, "report-list" );

				scope.reflow( "hidden", "report-list-standby" );

				/*scope.$on( "show-previewed" )

				scope.$on( "show-expanded-account",
					function onShowExpandedHeader( ){
						scope.reflow( "shown", "header-expanded" );
					} );*/

				scope.$on( "show-report-list",
					function onShowReportList( ){
						scope.applyFlow( "shown" );
					} );

				scope.$on( "hide-report-list",
					function onHideReportList( ){
						scope.applyFlow( "hidden" );
					} );

				React.renderComponent( <crimeReportList scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );