Crime.directive( "crimeLogin", [
	function directive( ){
		var crimeLogin = React.createClass( {
			"onClick": function onClick( ){
				FB.getLoginStatus( function onReponseLoginStatus( response ){
					if( response.status === "connected" ){
						console.debug( response );
					}else {
						FB.login( function onLogin( response ){
							console.debug( response );
						} );
					}
				} );
			},

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
								onClick={ this.onClick }
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
				React.renderComponent( <crimeLogin scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );