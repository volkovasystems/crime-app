Crime.directive( "crimeProfile", [
	function directive( ){
		var crimeProfile = React.createClass( {

			"render": function onRender( ){
				return ( 
					<div className="crime-profile-container">
						
					</div>
				);
			}
		} );

		return {
			"restrict": "EA",
			"link": function onLink( scope, element, attributeSet ){
				React.renderComponent( <crimeProfile scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );