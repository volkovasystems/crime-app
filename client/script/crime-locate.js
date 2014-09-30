Crime.directive( "crimeLocate", [
	function directive( ){
		var crimeLocate = React.createClass( {
			"render": function onRender( ){
				return ( 
					<div className="crime-locate-container">
					</div>
				);
			}
		} );

		return {
			"restrict": "EA",
			"link": function onLink( scope, element, attributeSet ){
				React.renderComponent( <crimeLocate />, element[ 0 ] );
			}
		};
	}
] );