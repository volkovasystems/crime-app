angular.module( "Login", [ "Event", "PageFlow", "ProgressBar", "Home" ] )

	.value( "LOGGED_IN_PROMPT", "welcome" )

	.value( "LOGGING_IN_PROMPT", "please wait" )

	.value( "LOGIN_ERROR_PROMPT", "oops! please try again" )

	.constant( "FACEBOOK_LOGIN_TYPE", "facebook" )
	
	.factory( "Login", [
		"APP_LOGO_IMAGE_SOURCE",
		"FACEBOOK_LOGIN_TYPE",
		"LOGGING_IN_PROMPT",
		"LOGGED_IN_PROMPT",
		"LOGIN_ERROR_PROMPT",
		function factory( 
			APP_LOGO_IMAGE_SOURCE, 
			FACEBOOK_LOGIN_TYPE,
			LOGGING_IN_PROMPT,
			LOGGED_IN_PROMPT,
			LOGIN_ERROR_PROMPT
		){
			var Login = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						React.render( <Login scope={ scope } />, container[ 0 ] );

						return this;
					},

					"tryLoggingInFacebook": function tryLoggingInFacebook( callback ){
						callback = callback || function callback( ){ };

						FB.login( function onLogin( response ){
							if( response.error ){
								callback( response.error, false, null, response );

							}else if( response.status == "connected" ){
								var loginData = {
									"loginType": FACEBOOK_LOGIN_TYPE,
									"userID": response.authResponse.userID,
									"accessToken": response.authResponse.accessToken
								};

								callback( null, true, loginData, response );
							
							}else{
								callback( null, false, null, response );
							}
						} );
					},

					"tryLoggingIn": function tryLoggingIn( loginType, callback ){
						callback = callback || function callback( ){ };

						switch( loginType ){
							case FACEBOOK_LOGIN_TYPE:
								this.tryLoggingInFacebook( callback );
								break;
						}
					},

					"checkIfLoggedInFacebook": function checkIfLoggedInFacebook( callback ){
						callback = callback || function callback( ){ };

						FB.getLoginStatus( function onReponseLoginStatus( response ){
							if( response.error ){
								callback( response.error, false, null, response );

							}else if( response.status === "connected" ){
								var loginData = {
									"loginType": FACEBOOK_LOGIN_TYPE,
									"userID": response.authResponse.userID,
									"accessToken": response.authResponse.accessToken
								};

								callback( null, true, loginData, response );		

							}else{
								callback( null, false, null, response );
							}
						} );
					},

					"checkIfLoggedIn": function checkIfLoggedIn( loginType, callback ){
						callback = callback || function callback( ){ };

						switch( loginType ){
							case FACEBOOK_LOGIN_TYPE:
								this.checkIfLoggedInFacebook( callback );
								break;
						}	
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"appLogoImageSource": APP_LOGO_IMAGE_SOURCE,

						"loginPrompt": "",
						
						"loginType": FACEBOOK_LOGIN_TYPE,

						"loginState": "logged-out",
						"componentState": "login-standby",

						"userID": "",
						"accessToken": ""
					};
				},

				"verifyIfLoggedIn": function verifyIfLoggedIn( loginState, responseList ){
					if( typeof loginState == "object" ||
						loginState instanceof Error )
					{
						var error = loginState;
						this.scope.publish( "error", "login-error", error, responseList );
						
						this.setState( {
							"loginState": "login-error",
							"loginPrompt": LOGIN_ERROR_PROMPT
						} );

					}else if( typeof loginState == "boolean" && loginState ){
						this.setState( {
							"loginState": "logged-in",
							"loginPrompt": LOGGED_IN_PROMPT
						} );

					}else{
						var error = new Error( "unable to log in" );
						this.scope.publish( "error", "login-error", error, responseList );
						
						this.setState( {
							"loginState": "login-error",
							"loginPrompt": LOGIN_ERROR_PROMPT
						} );					
					}
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
								"loginPrompt": LOGGING_IN_PROMPT
							}, function onSetState( ){
								callback( );
							} );
						},

						function checkIfLoggedIn( callback ){
							Login.checkIfLoggedIn( self.state.loginType,
								function onCheckIfLoggedIn( error, isLoggedIn, loginData, response ){
									var loginState = error || isLoggedIn || undefined;

									if( isLoggedIn ){
										self.setState( {
											"userID": loginData.userID,
											"accessToken": loginData.accessToken
										} );
									}

									callback( loginState, loginData, response );
								} );
						},

						function tryLoggingIn( loginData, response, callback ){
							Login.tryLoggingIn( self.state.loginType,
								function onTryLoggingIn( error, isLoggedIn, loginData, response ){
									callback( error || isLoggedIn, loginData, response );
								} );
						},

						function setLoginData( loginData, response, callback ){
							self.setState( {
								"userID": loginData.userID,
								"accessToken": loginData.accessToken
							}, function onSetState( ){
								callback( null, response );
							} );
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
						this.scope.publish( "proceed-default-app-flow", {
							"loginType": this.state.loginType,
							"userID": this.state.userID,
							"accessToken": this.state.accessToken
						} );
					}
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "change-logo-image",
						function onChangeLogoImage( appLogoImageSource ){
							self.setState( {
								"appLogoImageSource": appLogoImageSource
							} );
						} );

					this.scope.on( "get-user-account-data",
						function onGetUserAccountData( callback ){
							if( self.state.userID && self.state.accessToken ){
								var userAccountData = {
									"userID": self.state.userID,
									"accessToken": self.state.accessToken
								};

								callback( null, userAccountData );

							}else{
								Login.checkIfLoggedIn( self.state.loginType,
									function onCheckIfLoggedIn( error, isLoggedIn, loginData, response ){
										if( isLoggedIn ){
											callback( null, {
												"userID": loginData.userID,
												"accessToken": loginData.accessToken
											} );

										}else{
											callback( null, { } );
										}
									} );
							}
						} );
				},

				"notifyLoginState": function notifyLoginState( ){
					this.scope.broadcast( this.state.loginState, this.state.loginType );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );		
				},

				"render": function onRender( ){
					var appLogoImageSource = this.state.appLogoImageSource;

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
										src={ appLogoImageSource } />
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
						this.notifyLoginState( );
					}
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.broadcast( "login-rendered" );	
				}
			} );

			return Login;
		}
	] )

	.directive( "login", [
		"ProgressBar",
		"PageFlow",
		"Event",
		"Login",
		function directive( ProgressBar, PageFlow, Event, Login ){
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

					Login.attach( scope, element );
				}
			};
		}
	] );