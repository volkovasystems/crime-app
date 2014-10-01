Crime.directive( "crimeSpinner", [
	function directive( ){
		var crimeSpinner = React.createClass( {
			"componentWillMount": function componentWillMount( ){
				this.props.scope.$on( "spinner-footer",
					function onSpinnerFooter( ){
						$( ".crime-spinner-component" ).spin( );

						$( ".crime-spinner-component" )
							.removeClass( "center whole footer" )
							.addClass( "footer" );
					} );

				this.props.scope.$on( "spinner-center",
					function onSpinnerCenter( ){
						$( ".crime-spinner-component" ).spin( );

						$( ".crime-spinner-component" )
							.removeClass( "center whole footer" )
							.addClass( "center" );
					} );

				this.props.scope.$on( "spinner-whole",
					function onSpinnerWhole( ){
						$( ".crime-spinner-component" ).spin( );

						$( ".crime-spinner-component" )
							.removeClass( "center whole footer" )
							.addClass( "whole" );
					} );

				this.props.scope.$on( "spinner-off",
					function onSpinnerOff( ){
						$( ".crime-spinner-component" ).spin( false );
					} );
			},

			"render": function onRender( ){
				return ( 
					<div className="crime-spinner-container">
						<div className="crime-spinner-component row col-md-2 col-md-offset-5 col-xs-4 col-xs-offset-4">
						</div>
					</div>
				);
			},

			"componentDidMount": function componentDidMount( ){
				$( ".crime-spinner-component" ).spin( false );
			}
		} );

		return {
			"restrict": "EA",
			"link": function onLink( scope, element, attributeSet ){
				element.addClass( "hidden" );

				scope.$on( "spinner-footer",
					function onSpinnerFooter( ){
						element.removeClass( "hidden" ).addClass( "active" );
					} );

				scope.$on( "spinner-center",
					function onSpinnerCenter( ){
						element.removeClass( "hidden" ).addClass( "active" );
					} );

				scope.$on( "spinner-whole",
					function onSpinnerWhole( ){
						element.removeClass( "hidden" ).addClass( "active" );
					} );

				scope.$on( "spinner-off",
					function onSpinnerOff( ){
						element.removeClass( "active" ).addClass( "hidden" );
					} );

				React.renderComponent( <crimeSpinner scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );