Crime.directive( "crimeAccount", [
	"PageFlow",
	function directive( PageFlow ){
		var crimeAccount = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"componentState": "account-standby"
				};
			},

			"componentWillMount": function componentWillMount( ){
			},

			"render": function onRender( ){
				var componentState = this.state.componentState;

				return ( 
					<div 
						className={ [
							"crime-account-container",
							componentState
						].join( " " ) }>

					</div>
				);
			},

			"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
			},

			"componentDidMount": function componentDidMount( ){
				this.props.scope.$root.$broadcast( "crime-account-rendered" );	
			}
		} );

		return {
			"restrict": "EA",
			"scope": true,
			"link": function onLink( scope, element, attributeSet ){
				PageFlow( scope, element, "account" );

				scope.reflow( "hidden", "account-standby" );

				scope.$on( "show-previewed" )

				scope.$on( "show-expanded-account",
					function onShowExpandedHeader( ){
						scope.reflow( "shown", "header-expanded" );
					} );

				scope.$on( "show-account",
					function onShowHeader( ){
						scope.applyFlow( "shown" );
					} );

				scope.$on( "hide-account",
					function onHideHeader( ){
						scope.applyFlow( "hidden" );
					} );

				React.renderComponent( <crimeAccount scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );