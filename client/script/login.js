angular.module( "Login", [ "Event", "PageFlow", "Store", "ProgressBar", "Home", "Spinner" ] )

	.value( "LOGIN_LABEL", labelData.LOGIN_LABEL )

	.constant( "FACEBOOK_LOGIN_TYPE", "facebook" )

	.constant( "POPUP_LOGIN_FLOW", "popup-login-flow" )

	.constant( "REDIRECT_LOGIN_FLOW", "redirect-login-flow" )
	
	.factory( "Login", [
		"Store",
		"Event",
		"$rootScope",
		"APP_LOGO_IMAGE_SOURCE",
		"FACEBOOK_LOGIN_TYPE",
		"LOGIN_LABEL",
		"POPUP_LOGIN_FLOW",
		"REDIRECT_LOGIN_FLOW",
		"attachSpinner",
		function factory(
			Store,
			Event,
			$rootScope,
			APP_LOGO_IMAGE_SOURCE, 
			FACEBOOK_LOGIN_TYPE,
			LOGIN_LABEL,
			POPUP_LOGIN_FLOW,
			REDIRECT_LOGIN_FLOW,
			attachSpinner
		){
			Event( $rootScope );

			Store( $rootScope );

			var Login = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						React.render( <Login scope={ scope } />, container[ 0 ] );

						return this;
					},

					"tryLoggingInFacebook": function tryLoggingInFacebook( callback, loginFlow ){
						callback = callback || function callback( ){ };

						if( loginFlow == POPUP_LOGIN_FLOW ){
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
							}, { "scope": "email" } );

						}else if( loginFlow == REDIRECT_LOGIN_FLOW ){
							async.waterfall( [
								function getHostAddress( callback ){
									$rootScope.publish( "get-host-address",
										function onGetHostAddress( error, hostAddress ){
											if( error ){
												callback( error );

											}else{
												var uri = new URI( );
												var currentHostAddress = [ 
													"http:/",
													uri.host( )
												].join( "/" );

												if( hostAddress != currentHostAddress ){
													callback( error, currentHostAddress );

												}else{
													callback( error, hostAddress );
												}
											}
										} );
								},

								function getFacebookAppID( hostAddress, callback ){
									$rootScope.publish( "get-facebook-app-id",
										function onGetFacebookAppID( error, facebookAppID ){
											callback( error, hostAddress, facebookAppID );
										} )
								},

								function constructRedirectURL( hostAddress, facebookAppID ){
									var footprint = uuid.v4( );

									$rootScope.storeValue( "footprint", footprint );

									hostAddress = [ hostAddress, "has-logged-in" ].join( "?" );

									var redirectURL = [ 
										"https://www.facebook.com/dialog/oauth/?",
										[ 
											[ "client_id" , facebookAppID ].join( "=" ),
											[ "redirect_uri", hostAddress ].join( "=" ),
											[ "state", footprint ].join( "=" ),
											[ "scope", "email" ].join( "=" )
										].join( "&" )
									].join( "" );

									window.location = redirectURL;
								}
							] );
						}
					},

					"tryLoggingIn": function tryLoggingIn( loginType, callback, loginFlow ){
						callback = callback || function callback( ){ };

						switch( loginType ){
							case FACEBOOK_LOGIN_TYPE:
								this.tryLoggingInFacebook( callback, loginFlow );
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
									"accessToken": response.authResponse.accessToken,
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

						"loginType": FACEBOOK_LOGIN_TYPE,
						"loginFlow": REDIRECT_LOGIN_FLOW,

						"loginState": "logged-out",
						"componentState": "login-standby",

						"userID": "",
						"accessToken": ""
					};
				},

				"initiateLoginProcedure": function initiateLoginProcedure( callback ){
					callback = callback || function callback( ){ };

					var self = this;

					async.waterfall( [
						function initiateLoading( callback ){
							self.scope.startLoading( );

							self.scope.notify( "show-spinner", "login-spinner" );

							callback( );
						},

						function setLoggingInState( callback ){
							if( self.state.loginState == "logging-in" ){
								callback( );

							}else{
								self.setState( {
									"loginState": "logging-in"
								}, function onSetState( ){
									callback( );
								} );	
							}
						},

						function checkIfLoggedIn( callback ){
							Login.checkIfLoggedIn( self.state.loginType,
								function onCheckIfLoggedIn( error, isLoggedIn, loginData, response ){
									if( error ){
										callback( error, response );

									}else if( isLoggedIn ){
										self.setState( {
											"userID": loginData.userID,
											"accessToken": loginData.accessToken
										}, function onStateChanged( ){
											callback( "has-logged-in" );
										} );

									}else{
										callback( );
									}
								} );
						},

						function tryLoggingIn( callback ){
							Login.tryLoggingIn( self.state.loginType,
								function onTryLoggingIn( error, isLoggedIn, loginData, response ){
									if( error ){
										callback( error, response );

									}else{
										callback( null,  loginData );
									}

								}, self.state.loginFlow );
						},

						function setLoginData( loginData, callback ){
							self.setState( {
								"userID": loginData.userID,
								"accessToken": loginData.accessToken
							}, function onSetState( ){
								callback( null, response );
							} );
						}
					],
						function lastly( state, response ){
							if( state === "has-logged-in" ){
								self.setState( {
									"loginState": "logged-in"
								} );

								callback( null, true );

							}else if( state instanceof Error ){
								self.scope.publish( "error", "login-error", error, response );
								
								self.setState( {
									"loginState": "login-error"
								} );

								callback( state, false );
							}

							self.scope.notify( "hide-spinner", "login-spinner" );

							self.scope.finishLoading( );							
						} );
				},

				"onClickLogin": function onClickLogin( event ){
					if( this.state.loginState == "logged-out" ){
						this.initiateLoginProcedure( );	
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

					this.scope.on( "initiate-login-check",
						function onInitiateLoginCheck( callback ){
							if( self.state.loginState != "logged-in" ){
								self.initiateLoginProcedure( callback );
							}
						} );

					this.scope.on( "check-if-logged-in",
						function onCheckIfLoggedIn( callback ){
							self.scope.notify( "show-spinner", "login-spinner" );

							Login.checkIfLoggedIn( self.state.loginType,
								function onCheckIfLoggedIn( error, isLoggedIn, loginData, response ){
									self.scope.notify( "hide-spinner", "login-spinner" );
									
									if( error ){
										callback( error );

									}else if( isLoggedIn ){
										self.setState( {
											"userID": loginData.userID,
											"accessToken": loginData.accessToken,
											"loginState": "logged-in"
										}, function onStateChanged( ){
											callback( null, true );
										} );

									}else{
										callback( null, false );
									}
								} );
						} );

					this.scope.on( "set-logging-in-state",
						function onSetLoggingInState( ){
							self.setState( {
								"loginState": "logging-in"
							} );
						} );

					this.scope.on( "set-logged-out-state",
						function onSetLoggingInState( ){
							self.setState( {
								"loginState": "logged-out"
							} );
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
					
					var loginState = this.state.loginState;
					
					var componentState = this.state.componentState;

					return; //: @template: template/login.html
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					if( this.state.loginState != prevState.loginState ){
						this.notifyLoginState( );
					}
				},

				"componentDidMount": function componentDidMount( ){
					attachSpinner( {
						"scope": this.scope,
						"element": $( ".login-spinner", this.getDOMNode( ) ),
						"namespace": "login-spinner"
					} );

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