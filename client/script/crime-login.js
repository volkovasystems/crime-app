Crime.directive( "crimeLogin", [
	"PageFlow",
	function directive( PageFlow ){
		var crimeLogin = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"componentState": "normal",
					"loginState": "login-standby",
					"loginPrompt": "",
					"loginType": "facebook"
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
					this.props.scope.$root.$broadcast( "error", "login-error", error, responseList );
					
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
					this.props.scope.$root.$broadcast( "error", "login-error", error, responseList );
					
					this.setState( {
						"loginState": "login-error",
						"loginPrompt": "oops! please try again"
					} );					
				}
			},

			"initiateLoginProcedure": function initiateLoginProcedure( ){
				var self = this;

				async.waterfall( [
						function setLoggingInState( callback ){
							self.setState( {
								"loginState": "logging-in",
								"loginPrompt": "please wait"
							}, callback );
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
						}
					],
					function lastly( loginState, responseList ){
						self.verifyIfLoggedIn( loginState, responseList );
					} );
			},

			"proceedRapidFlow": function proceedRapidFlow( ){
				this.props.scope.$root.$broadcast( "hide-home" );
				this.props.scope.$root.$broadcast( "hide-login" );
				this.props.scope.$root.$broadcast( "show-normal-map" );
				this.props.scope.$root.$broadcast( "show-search" );								
			},

			"onClickLogin": function onClickLogin( event ){
				if( this.state.loginState == "login-standby" ){
					this.initiateLoginProcedure( );
					
				}else if( this.state.loginState == "logged-in" ){
					this.proceedRapidFlow( );
				}
			},

			"attachAllComponentEventListener": function attachAllComponentEventListener( ){
				var self = this;

				this.props.scope.$on( "show-home",
					function onShowHome( ){
						self.setState( {
							"componentState": "home-component-shown"
						} );
					} );
			},

			"componentWillMount": function componentWillMount( ){
				this.attachAllComponentEventListener( );		
			},

			"render": function onRender( ){
				var loginState = this.state.loginState;
				var loginType = this.state.loginType;
				var loginPrompt = this.state.loginPrompt;
				var componentState = this.state.componentState;

				return ( 
					<div className="crime-login-container">
						<div 
							className={ [
								"login-component",
								"col-xs-8",
								"col-xs-offset-2",
								"col-sm-4",
								"col-sm-offset-4",
								"col-md-4",
								"col-md-offset-4",
								"col-lg-4",
								"col-lg-offset-4",
								componentState,
								loginState
							].join( " " ) }>

							<div
								className={ [
									"login-prompt",
									"text-center",
									"col-xs-12",
									"col-sm-12",
									"col-md-12",
									"col-lg-6",
									"col-lg-offset-3",
									( loginState != "login-standby" )? "shown": "hidden",
									( loginState == "login-error" )? "bg-danger": "",
									( loginState == "logged-in" )? "bg-success": "",
									( loginState == "logging-in" )? "bg-info": "",
									loginState
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
									"col-xs-12",
									"col-sm-12",
									"col-md-12",
									"col-lg-6",
									"col-lg-offset-3",
									( 
										loginType == "facebook" &&
										( 
											loginState == "login-standby" || 
											loginState == "logged-in" 
										)
									)? "shown": "hidden",
									loginState
								].join( " " ) }
								value="facebook"
								type="button"
								onClick={ this.onClickLogin }>
								<span
									className={ [
										"login-icon",
										( loginState == "login-standby" )? "entypo-social facebook": "",
										( loginState == "logged-in" )? "entypo thumbs-up": ""
									].join( " " ) }>
								</span>
								<a
									className={ [
										"action-element"
									].join( " " ) }
									href={ [ 
										"#",
										loginState
									].join( "/" ) }>
									{ 
										( loginState == "login-standby" )? "LOGIN" :
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
									"col-xs-12",
									"col-sm-12",
									"col-md-12",
									"col-lg-6",
									"col-lg-offset-3",
									( 
										loginType == "twitter" &&
										( 
											loginState == "login-standby" || 
											loginState == "logged-in" 
										)
									)? "shown": "hidden",
									loginState
								].join( " " ) }
								value="twitter"
								type="button"
								onClick={ this.onClickLogin }>
								<span
									className={ [
										"login-icon",
										( loginState == "login-standby" )? "entypo-social twitter": "",
										( loginState == "logged-in" )? "entypo thumbs-up": ""
									].join( " " ) }>
								</span>
								{ 
									( loginState == "login-standby" )? "LOGIN" :
									( loginState == "logged-in" )? "PROCEED" : ""
								}
							</button>

						</div>
					</div>
				);
			},

			"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
				if( this.state.loginState != prevState.loginState ){
					this.props.scope.$root.$broadcast( this.state.loginState, this.state.loginType );
				}
			},

			"componentDidMount": function componentDidMount( ){
				this.props.scope.$root.$broadcast( "crime-login-rendered" );	
			}
		} );

		return {
			"restrict": "EA",
			"scope": true,
			"link": function onLink( scope, element, attributeSet ){
				PageFlow( scope, element );

				scope.wholePageDown( );

				scope.$on( "show-default-page",
					function onShowDefaultPage( ){
						scope.$root.$broadcast( "show-login" );
					} );

				scope.$on( "hide-default-page",
					function onHideMap( ){
						scope.$root.$broadcast( "hide-login" );
					} );

				scope.$on( "show-login",
					function onShowMap( ){
						scope.wholePageDown( );
						scope.wholePageCenter( );
					} );

				scope.$on( "hide-login",
					function onHideMap( ){
						scope.wholePageDown( );
					} );

				React.renderComponent( <crimeLogin scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );