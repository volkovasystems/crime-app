Crime.directive( "crimeLogin", [
	function directive( ){
		var crimeLogin = React.createClass( {
			"render": function onRender( ){
				return ( 
					<div className="crime-login-container">
						<div 
							className={ [
								"facebook-login-container",
								"row",
								"col-md-4",
								"col-md-offset-4",
								"col-xs-6",
								"col-xs-offset-3" 
							].join( " " ) }>
							<button 
								type="button"
								className={ [
									"facebook-login-button",
									"btn",
									"btn-lg",
									"btn-primary",
									"col-md-12",
									"col-xs-12"
								].join( " " ) }>
								LOGIN
							</button>
						</div>
					</div>
				);
			}
		} );

		return {
			"restrict": "EA",
			"link": function onLink( scope, element, attributeSet ){
				React.renderComponent( <crimeLogin />, element[ 0 ] );
			}
		};
	}
] );