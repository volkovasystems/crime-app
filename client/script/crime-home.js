Crime.directive( "crimeHome", [
	function directive( ){
		var crimeHome = React.createClass( {
			"render": function onRender( ){
				return (
					<div className="crime-home-container">
						<div 
							className={ [
								"crime-home-logo",
								"row",
								"col-md-2",
								"col-md-offset-5",
								"col-xs-6",
								"col-xs-offset-3"
							].join( " " ) }>
						</div>
					</div>
				);
			}
		} );

		return {
			"restrict": "EA",
			"link": function onLink( scope, element, attributeSet ){
				React.renderComponent( <crimeHome />, element[ 0 ] );
			}
		};
	}
] );
