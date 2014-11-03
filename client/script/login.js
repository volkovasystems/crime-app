Crime.directive( "login", [
	"ProgressBar",
	"PageFlow",
	"Event",
	"APP_LOGO_IMAGE_SOURCE",
	function directive( ProgressBar, PageFlow, Event, APP_LOGO_IMAGE_SOURCE ){
		var login = React.createClass( {
			"statics": {
				"attach": function attach( scope, container ){
					React.renderComponent( <login scope={ scope } />, container[ 0 ] );

					return this;
				}
			},

			"getInitialState": function getInitialState( ){
				return {
					"loginPrompt": "",
					
					"loginType": "facebook",

					"loginState": "logged-out",
					"componentState": "login-standby",

					"userID": "",
					"accessToken": ""
				};
			},

			"tryLoggingInFacebook": function tryLoggingInFacebook( callback ){
				callback = callback || function callback( ){ };

				FB.login( function onLogin( response ){
					if( response.error ){
						callback( response.error, false, response );

					}else if( response.status == "connected" ){
						callback( null, true, response );
					
					}else{
						callback( null, false, response );
					}
				} );
			},

			"tryLoggingIn": function tryLoggingIn( callback ){
				callback = callback || function callback( ){ };

				switch( this.state.loginType ){
					case "facebook":
						this.tryLoggingInFacebook( callback );
						break;
				}
			},

			"checkIfLoggedInFacebook": function checkIfLoggedInFacebook( callback ){
				callback = callback || function callback( ){ };

				FB.getLoginStatus( function onReponseLoginStatus( response ){
					if( response.error ){
						callback( response.error, false, response );

					}else if( response.status === "connected" ){
						callback( null, true, response );		

					}else{
						callback( null, false, response );
					}
				} );
			},

			"checkIfLoggedIn": function checkIfLoggedIn( callback ){
				callback = callback || function callback( ){ };

				switch( this.state.loginType ){
					case "facebook":
						this.checkIfLoggedInFacebook( callback );
						break;
				}	
			},

			"verifyIfLoggedIn": function verifyIfLoggedIn( loginState, responseList ){
				if( typeof loginState == "object" ||
					loginState instanceof Error )
				{
					var error = loginState;
					this.scope.broadcast( "error", "login-error", error, responseList );
					
					this.setState( {
						"loginState": "login-error",
						"loginPrompt": "oops! please try again"
					} );

				}else if( typeof loginState == "boolean" && loginState ){
					this.setState( {
						"loginState": "logged-in",
						"loginPrompt": "welcome"
					} );

				}else{
					var error = new Error( "unable to log in" );
					this.scope.broadcast( "error", "login-error", error, responseList );
					
					this.setState( {
						"loginState": "login-error",
						"loginPrompt": "oops! please try again"
					} );					
				}
			},

			"sendLoginData": function sendLoginData( ){
				this.scope.publish( "get-profile-data",
					this.state.loginType,
					function onGetProfileData( ){

					} );
			},

			"initiateLoginProcedure": function initiateLoginProcedure( ){
				var self = this;

				async.waterfall( [
					function initiateLoading( callback ){
						self.scope.startLoading( );

						callback( );
					},

					function setLoggingInState( callback ){
						self.setState( {
							"loginState": "logging-in",
							"loginPrompt": "please wait"
						}, function onSetState( ){
							callback( );
						} );
					},

					function checkIfLoggedIn( callback ){
						self.checkIfLoggedIn( function onCheckIfLoggedIn( error, isLoggedIn, response ){
							var loginState = error || isLoggedIn || undefined;

							callback( loginState, response );
						} );
					},

					function tryLoggingIn( response, callback ){
						self.tryLoggingIn( function onTryLoggingIn( error, isLoggedIn, response ){
							callback( error || isLoggedIn, response );
						} );
					},

					function setLoginData( response, callback ){
						self.setState( {
							"userID": response.authResponse.userID,
							"accessToken": response.authResponse.accessToken
						}, function onSetState( ){
							callback( null, response );
						} );
					},

					function sendLoginData( response, callback ){

					}
				],
					function lastly( loginState, responseList ){
						self.verifyIfLoggedIn( loginState, responseList );

						self.scope.finishLoading( );
					} );
			},

			"onClickLogin": function onClickLogin( event ){
				if( this.state.loginState == "logged-out" ){
					this.initiateLoginProcedure( );
					
				}else if( this.state.loginState == "logged-in" ){
					this.scope.publish( "proceed-default-app-flow" );
				}
			},

			"attachAllComponentEventListener": function attachAllComponentEventListener( ){
				var self = this;
			},

			"componentWillMount": function componentWillMount( ){
				this.scope = this.props.scope;

				this.attachAllComponentEventListener( );		
			},

			"render": function onRender( ){
				var loginType = this.state.loginType;
				
				var loginPrompt = this.state.loginPrompt;
				
				var loginState = this.state.loginState;
				
				var componentState = this.state.componentState;

				return ( 
					<div className={ [
							"login-container",
							loginState,
							componentState
						].join( " " ) }>
						<div 
							className={ [
								"login-component",
								loginState,
								componentState,
							].join( " " ) }>

							<div
								className={ [
									"login-logo-container",
									"shown",
									"inline-block",
									loginState,
									componentState 
								].join( " " ) }>

								<img
									className={ [
										"logo",
										componentState
									].join( " " ) }
									src={ APP_LOGO_IMAGE_SOURCE } />
							</div>

							<div
								className={ [
									"login-prompt",
									"text-center",
									( loginState != "logged-out" )? "shown inline-block": "hidden",
									( loginState == "login-error" )? "bg-danger": "",
									( loginState == "logged-in" )? "bg-success": "",
									( loginState == "logging-in" )? "bg-info": "",
									loginState,
									componentState
								].join( " " ) }>
								{ loginPrompt.toUpperCase( ) }
							</div>

							{ /* Facebook login button. */ }
							<button 
								className={ [
									"facebook-login-button",
									"btn",
									"btn-lg",
									"btn-primary",
									"login-button",
									( 
										loginType == "facebook" &&
										( 
											loginState == "logged-out" || 
											loginState == "logged-in" 
										)
									)? "shown inline-block": "hidden",
									loginState,
									componentState
								].join( " " ) }
								value="facebook"
								type="button"
								onClick={ this.onClickLogin }>
								<a
									className={ [
										"action-element"
									].join( " " ) }
									href={ [ 
										"#",
										loginState
									].join( "/" ) }>
									<span
										className={ [
											"login-icon",
											( loginState == "logged-out" )? "entypo-social facebook": "",
											( loginState == "logged-in" )? "entypo thumbs-up": ""
										].join( " " ) }>
									</span>
									{ 
										( loginState == "logged-out" )? "LOGIN" :
										( loginState == "logged-in" )? "PROCEED" : ""
									}
								</a>
							</button>

							{ /* Twitter login button. */ }
							<button 
								className={ [
									"twitter-login-button",
									"btn",
									"btn-lg",
									"btn-primary",
									"login-button",
									( 
										loginType == "twitter" &&
										( 
											loginState == "logged-out" || 
											loginState == "logged-in" 
										)
									)? "shown inline-block": "hidden",
									loginState,
									componentState
								].join( " " ) }
								value="twitter"
								type="button"
								onClick={ this.onClickLogin }>
								<a
									className={ [
										"action-element"
									].join( " " ) }
									href={ [ 
										"#",
										loginState
									].join( "/" ) }>
									<span
										className={ [
											"login-icon",
											( loginState == "logged-out" )? "entypo-social twitter": "",
											( loginState == "logged-in" )? "entypo thumbs-up": ""
										].join( " " ) }>
									</span>
									{ 
										( loginState == "logged-out" )? "LOGIN" :
										( loginState == "logged-in" )? "PROCEED" : ""
									}
								</a>
							</button>
						</div>
					</div>
				);
			},

			"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
				if( this.state.loginState != prevState.loginState ){
					this.scope.broadcast( this.state.loginState, this.state.loginType );
				}
			},

			"componentDidMount": function componentDidMount( ){
				this.scope.broadcast( "login-rendered" );	
			}
		} );

		return {
			"restrict": "EA",
			"scope": true,
			"link": function onLink( scope, element, attributeSet ){
				ProgressBar( scope );

				Event( scope );

				PageFlow( scope, element, "login" );

				scope.on( "show-default-page",
					function onShowDefaultPage( ){
						scope.broadcast( "show-login" );
					} );

				scope.on( "hide-default-page",
					function onHideDefaultPage( ){
						scope.broadcast( "hide-login" );
					} );

				scope.on( "show-login",
					function onShowLogin( ){
						scope.showPage( )
							.then.wholePage( )
							.then.wholePageCenter( );
					} );

				scope.on( "hide-login",
					function onHideLogin( ){
						scope.hidePage( );
					} );

				scope.on( "proceed-default-app-flow",
					function onProceedDefaultAppFlow( ){
						scope.broadcast( "hide-login" );
					} );

				scope.publish( "hide-login" );

				login.attach( scope, element );
			}
		};
	}
] );