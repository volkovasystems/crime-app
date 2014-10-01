Crime.directive( "crimeLogin", [
	function directive( ){
		var crimeLogin = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"loginState": "standby",
					"loginPrompt": "login"
				};
			},

			"componentWillMount": function componentWillMount( ){
				var self = this;
				this.props.scope.$on( "error",
					function onError( event, errorType, errorData, referenceData ){
						if( errorType == "login-error" ){
							self.props.scope.$root.$broadcast( "spinner-off" );

							self.setState( {
								"loginState": errorType,
								"loginPrompt": "oops sorry"
							} );	
						}
					} );

				this.props.scope.$on( "login-cancelled",
					function onLoginCancelled( ){
						self.props.scope.$root.$broadcast( "spinner-off" );

						self.setState( {
							"loginState": "standby",
							"loginPrompt": "login"
						} );
					} );

				this.props.scope.$on( "logging-in",
					function onLoggingIn( ){
						self.props.scope.$root.$broadcast( "spinner-footer" );

						self.setState( {
							"loginState": "logging-in",
							"loginPrompt": "please wait"
						} );
					} );

				this.props.scope.$on( "logged-in",
					function onLoggedIn( ){
						self.props.scope.$root.$broadcast( "spinner-off" );

						self.setState( {
							"loginState": "logged-in",
							"loginPrompt": "welcome"
						} );
					} );
			},

			"accessProfileData": function accessProfileData( onResponseProfileData ){
				FB.api( "/me",
					function onResponse( response ){
						onResponseProfileData( response.error, null, response );
					} );
			},

			"getLoginStatus": function getLoginStatus( ){
				var self = this;

				FB.getLoginStatus( function onReponseLoginStatus( response ){
					if( response.error ){
						self.props.scope.$root.$broadcast( "error", "login-error", error, response );

					}else{
						self.onLogin( response,
							function ifNotConnected( ){
								self.login( true );
							},
							function ifError( error ){
								self.props.scope.$root.$broadcast( "error", "login-error", error );
							} );	
					}
				} );
			},

			"onLogin": function onLogin( response, ifNotConnected, ifError ){
				if( ifNotConnected.name === "ifError" ){
					ifError = ifNotConnected;
					ifNotConnected = { };
				}

				if( response.status === "connected" ){
					this.props.scope.$root.$broadcast( "logged-in" );

					var self = this;
					this.accessProfileData( function onResponseProfileData( error, profileData, response ){
						if( error ){
							if( ifError.name === "ifError" ){
								ifError( error, response );
							}

						}else{
							self.props.scope.$root.$broadcast( "profile-data", profileData );
						}
					} );

				}else if( ifNotConnected.name === "ifNotConnected" ){
					ifNotConnected( );	
				}
			},

			"login": function login( oneTimeLogin ){
				this.props.scope.$root.$broadcast( "logging-in" );

				var self = this;
				FB.login( function onLogin( response ){
					if( response.error ){
						self.props.scope.$root.$broadcast( "error", "login-error", error, response );

					}else if( oneTimeLogin ){
						self.onLogin( response,
							function ifNotConnected( ){
								self.props.scope.$root.$broadcast( "error", "login-error", error, response );
							},
							function ifError( error ){
								self.props.scope.$root.$broadcast( "error", "login-error", error, response );
							} );

					}else{
						self.getLoginStatus( );
					}
				} );
			},

			"onClick": function onClick( ){
				if( this.state.loginState == "login-error" ){
					this.setState( {
						"loginState": "standby",
						"loginPrompt": "login"
					} );

				}else if( this.state.loginState == "logged-in" ){

				}else{
					this.getLoginStatus( );	
				}
			},

			"render": function onRender( ){
				var loginState = this.state.loginState;
				var loginPrompt = this.state.loginPrompt;

				return ( 
					<div className="crime-login-container">
						<div 
							className={ [
								"facebook-login-container",
								"row",
								"col-md-4",
								"col-md-offset-4",
								"col-xs-8",
								"col-xs-offset-2" 
							].join( " " ) }>
							<button 
								type="button"
								onClick={ this.onClick }
								disabled={ loginState == "logging-in" }
								className={ [
									"facebook-login-button",
									"btn",
									"btn-lg",
									( loginState == "standby" )? "btn-primary": "",
									( loginState == "logged-in" )? "btn-success": "",
									( loginState == "login-error" )? "btn-danger": "",
									"col-md-12",
									"col-xs-12"
								].join( " " ) }>

								{ loginPrompt.toUpperCase( ) }

							</button>
						</div>
					</div>
				);
			}
		} );

		return {
			"restrict": "EA",
			"link": function onLink( scope, element, attributeSet ){
				scope.$on( "error",
					function onError( event, errorType, errorData, referenceData ){

					} );

				scope.$on( "login-cancelled",
					function onLoginCancelled( ){
						
					} );

				scope.$on( "logging-in",
					function onLoggedIn( ){

					} );

				scope.$on( "logged-in",
					function onLoggedIn( ){

					} );

				React.renderComponent( <crimeLogin scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );