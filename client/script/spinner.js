Crime.directive( "crimeSpinner", [
	"PageFlow",
	function directive( PageFlow ){
		var crimeSpinner = React.createClass( {
			"componentWillMount": function componentWillMount( ){
				this.props.scope.$on( "spinner-header",
					function onSpinnerHeader( ){
						$( ".crime-spinner-component" ).spin( );

						$( ".crime-spinner-component" )
							.removeClass( "center whole footer header" )
							.addClass( "header" );
					} );

				this.props.scope.$on( "spinner-footer",
					function onSpinnerFooter( ){
						$( ".crime-spinner-component" ).spin( );

						$( ".crime-spinner-component" )
							.removeClass( "center whole footer header" )
							.addClass( "footer" );
					} );

				this.props.scope.$on( "spinner-center",
					function onSpinnerCenter( ){
						$( ".crime-spinner-component" ).spin( );

						$( ".crime-spinner-component" )
							.removeClass( "center whole footer header" )
							.addClass( "center" );
					} );

				this.props.scope.$on( "spinner-whole",
					function onSpinnerWhole( ){
						$( ".crime-spinner-component" ).spin( );

						$( ".crime-spinner-component" )
							.removeClass( "center whole footer header" )
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
						<div 
							className={ [
								"crime-spinner-component",
								"container",
								"row",
								"col-xs-4",
								"col-xs-offset-4",
								"col-sm-4",
								"col-sm-offset-4",
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
				$( ".crime-spinner-component" ).spin( false );
				this.props.scope.$root.$broadcast( "crime-spinner-rendered" );	
			}
		} );

		return {
			"restrict": "EA",
			"scope": true,
			"link": function onLink( scope, element, attributeSet ){
				PageFlow( scope, element );

				scope.wholePageUp( );

				scope.$on( "spinner-header",
					function onSpinnerHeader( ){
						scope.wholePageCenter( );
					} );

				scope.$on( "spinner-footer",
					function onSpinnerFooter( ){
						scope.wholePageCenter( );
					} );

				scope.$on( "spinner-center",
					function onSpinnerCenter( ){
						scope.wholePageCenter( );
					} );

				scope.$on( "spinner-whole",
					function onSpinnerWhole( ){
						scope.wholePageCenter( );
					} );

				scope.$on( "spinner-off",
					function onSpinnerOff( ){
						scope.wholePageUp( );
					} );

				React.renderComponent( <crimeSpinner scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );