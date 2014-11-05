angular.module( "Profile", [ "Event", "PageFlow", "Icon" ] )
	
	.constant( "GO_TO_PROFILE_PAGE", "go to profile page" )
	
	.factory( "Profile", [
		"Icon",
		"GO_TO_PROFILE_PAGE",
		function factory( Icon, GO_TO_PROFILE_PAGE ){
			var Profile = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						React.render( <Profile scope={ scope } />, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"profileName": "",
						"profileURL": "",
						"profileImage": "./image/profile.png",
						
						"profileType": "facebook",
						
						"profileState": "profile-empty",
						"componentState": "profile-minified"
					};
				},

				"getBasicProfileDataFromFacebook": function getBasicProfileDataFromFacebook( callback ){
					callback = callback || function callback( ){ };

					var profileData = { };

					async.parallel( [
						function requestProfileData( callback ){
							FB.api( "/me",
								function onResponse( response ){
									if( response.error ){
										callback( response.error, response );

									}else{
										profileData.profileName = response.name;
										profileData.profileURL = response.link;

										callback( null, response );
									}
								} );
						},

						function requestProfilePhoto( callback ){
							FB.api( "/me/picture",
								{
									"redirect": false,
									"height": 128,
									"type": "square",
									"width": 128
								},
								function onResponse( response ){
									if( response.error ){
										callback( response.error, response );

									}else{
										profileData.profileImage = response.data.url;

										callback( null, response );
									}
								} );
						}
					],
						function lastly( error, responseList ){
							callback( error, profileData, responseList );
						} );
				},

				"getBasicProfileData": function getBasicProfileData( callback ){
					callback = callback || function callback( ){ };

					switch( this.state.profileType ){
						case "facebook":
							this.getBasicProfileDataFromFacebook( callback );
							break;
					}
				},

				"onProfileCloseButtonClick": function onProfileCloseButtonClick( event ){
					if( this.state.componentState != "profile-minified" ){
						this.scope.broadcast( "show-minified-profile" );

						this.setState( {
							"componentState": "profile-minified"
						} );	
					}
				},

				"onProfileImageClick": function onProfileImageClick( event ){
					if( this.state.componentState != "profile-expanded" ){
						this.scope.broadcast( "show-expanded-profile" );

						this.setState( {
							"componentState": "profile-expanded"
						} );	
					}
				},

				"initiateBasicProfileDataRetrieval": function initiateBasicProfileDataRetrieval( profileType ){
					var self = this;
					this.setState( {
							"profileType": profileType,
							"profileState": "profile-processing"
						},
						function onStateChanged( ){
							self.getBasicProfileData( function onResult( error, profileData, responseList ){
								if( error ){
									self.scope.broadcast( "error", "login-error", error, responseList );

									self.setState( {
										"profileState": "profile-error",
									} );

								}else{
									self.setState( {
										"profileName": profileData.profileName,
										"profileURL": profileData.profileURL,
										"profileImage": profileData.profileImage,
										"profileState": "profile-ready"
									} );
								}
							} );
						} );
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;
					
					this.scope.on( "logged-in",
						function onLoggedIn( profileType ){
							self.scope.broadcast( "show-profile" );
							
							self.initiateBasicProfileDataRetrieval( profileType );	
						} );

					this.scope.on( "get-profile-data",
						function onGetLoginData( profileType, callback ){
							if( self.stte.profileState == "profile-ready" ){
								callback( {
									"profileName": self.state.profileName,
									"profileURL": self.state.profileURL,
									"profileImage": self.state.profileImage
								} );

								return;
							
							}else if( self.state.profileState != "profile-processing" ){
								//: It was not initiated before this was called then we have to force it.
								//: This is rarely be called, but we still need to handle this.
								self.initiateBasicProfileDataRetrieval( profileType );
							}

							//: Profile is in processing mode. Listen to a single instance event.
							//: @todo: This should be removed once it does what it does.
							self.scope.on( "profile-ready",
								function onProfileReady( ){
									callback( {
										"profileName": self.state.profileName,
										"profileURL": self.state.profileURL,
										"profileImage": self.state.profileImage
									} );
								} );
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					var componentState = this.state.componentState;

					var profileName = this.state.profileName;

					var profileURL = this.state.profileURL;

					var profileImage = this.state.profileImage;

					var profileType = this.state.profileType;
					
					var profileState = this.state.profileState;

					return ( 
						<div 
							className={ [
								"profile-container",
								profileState,
								componentState
							].join( " " ) }>
							
							<div 
								className={ [
									"profile-close-button",
									profileState,
									componentState
								].join( " " ) }
								onClick={ this.onProfileCloseButtonClick }>
								<a 
									className={ [
										"action-element"
									].join( " " ) }
									href={ [
										"#",
										"close-profile"
									].join( "/" ) }>
									
									<Icon
										className={ [
											"profile-close-icon"
										].join( " " ) }
										name="ic_close_24px" />
								</a>
							</div>

							<div
								className={ [
									"profile-data-container",
									profileState,
									componentState
								].join( " " ) }>

								<div
									className={ [
										"profile-image",
										profileState,
										componentState
									].join( " " ) }
									onClick={ this.onProfileImageClick }>
									<a 
										className={ [
											"action-element"
										].join( " " ) } 
										href={ [ 
											"#", 
											profileState 
										].join( "/" ) }>
										<img 
											className={ [
												"img-circle",
												profileState
											].join( " " ) } 
											src={ profileImage } />
									</a>
								</div>

								<div 
									className={ [ 
										"profile-data",
										componentState,
										profileState
									].join( " " ) }>

									<h2 
										className={ [
											"profile-name",
											"text-center",
											profileState,
											componentState
										].join( " " ) }>
										{ profileName.toUpperCase( ) }
									</h2>

									<div
										className={ [
											"profile-link",
											"text-center",
											profileState,
											componentState
										].join( " " ) }>
										<a 
											className={ [
												"action-element"
											].join( " " ) }
											href={ profileURL }>
											<span
												className={ [
													"entypo-social",
													profileType
												].join( " " ) }>
											</span>
											
											{ GO_TO_PROFILE_PAGE.toUpperCase( ) }
										</a>
									</div>								
								</div>
							</div>
						</div>
					);
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					if( this.state.profileState != prevState.profileState ){
						if( this.state.profileState == "profile-ready" ){
							var profileData = {
								"profileName": this.state.profileName,
								"profileURL": this.state.profileURL,
								"profileImage": this.state.profileImage,
								"profileState": this.state.profileState
							};

							this.scope.broadcast( this.state.profileState, profileData );
						
						}else{
							this.scope.broadcast( this.state.profileState );
						}

						this.scope.broadcast( "profile-state-changed", this.state.profileState, this.state.componentState );
					}
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.broadcast( "profile-rendered" );	
				}
			} );

			return Profile;
		}
	] )

	.directive( "profile", [
		"Event",
		"PageFlow",
		"GO_TO_PROFILE_PAGE",
		"Profile",
		function directive( Event, PageFlow, GO_TO_PROFILE_PAGE, Profile ){
			return {
				"restrict": "EA",
				"scope": true,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "profile" );
					
					scope.on( "show-minified-profile",
						function onShowMinifiedProfile( ){
							scope.broadcast( "show-profile" );

							scope.toggleFlow( "!profile-expanded", "profile-minified" );
						} );

					scope.on( "show-expanded-profile",
						function onShowExpandedProfile( ){
							scope.broadcast( "show-profile" );

							scope.toggleFlow( "!profile-minified", "profile-expanded" );
						} );

					scope.on( "show-profile",
						function onShowProfile( ){
							scope.showPage( );
						} );

					scope.on( "hide-profile",
						function onHideProfile( ){
							scope.hidePage( );
						} );

					scope.on( "profile-state-changed",
						function onProfileStateChanged( profileState, componentState ){
							scope.toggleFlow( "profile-*", profileState, componentState );

							scope.publish( profileState );
						} );

					scope.publish( "hide-profile" );

					Profile.attach( scope, element );
				}
			};
		}
	] );