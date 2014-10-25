Crime.directive( "crimeProfile", [
	"PageFlow",
	function directive( PageFlow ){
		var GO_TO_PROFILE_PAGE = "go to profile page";

		var crimeProfile = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"profileName": "",
					"profileURL": "",
					"profileImage": "./image/profile.png",
					"profileType": "facebook",
					"profileState": "profile-standby",
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
					this.props.scope.$root.$broadcast( "show-minified-profile" );

					this.setState( {
						"componentState": "profile-minified"
					} );	
				}
			},

			"onProfileImageClick": function onProfileImageClick( event ){
				if( this.state.componentState != "profile-expanded" ){
					this.props.scope.$root.$broadcast( "show-expanded-profile" );

					this.setState( {
						"componentState": "profile-expanded"
					} );	
				}
			},

			"initiateBasicProfileDataRetrieval": function initiateBasicProfileDataRetrieval( profileType ){
				var self = this;
				this.setState( {
						"profileType": profileType
					},
					function onStateChanged( ){
						self.getBasicProfileData( function onResult( error, profileData, responseList ){
							if( error ){
								self.props.scope.$root.$broadcast( "error", "login-error", error, responseList );

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
				this.props.scope.$on( "logged-in",
					function onLoggedIn( event, profileType ){
						self.props.scope.$root.$broadcast( "show-profile" );
						self.initiateBasicProfileDataRetrieval( profileType );	
					} );
			},

			"componentWillMount": function componentWillMount( ){
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
							"crime-profile-container",
							componentState,
							profileState
						].join( " " ) }>
						
						<div 
							className={ [
								"profile-close-button",
								"text-center",
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
								
								<icon
									className={ [
										"profile-close-icon"
									].join( " " ) }
									name="ic_close_24px"
									src="../library/svg-sprite-navigation.svg" />
							</a>
						</div>

						<div
							className={ [
								"profile-data-container",
								"col-md-8",
								"col-md-offset-2",
								componentState,
								profileState
							].join( " " ) }>

							<div
								className={ [
									"profile-image",
									componentState,
									profileState
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
											"media-object",
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
										"col-md-10",
										"col-md-offset-1",
										profileState,
										componentState
									].join( " " ) }>
									{ profileName.toUpperCase( ) }
								</h2>

								<div
									className={ [
										"profile-link",
										"col-md-6",
										"col-md-offset-3",
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
					var profileData = {
						"profileName": this.state.profileName,
						"profileURL": this.state.profileURL,
						"profileImage": this.state.profileImage,
						"profileState": this.state.profileState
					};

					this.props.scope.$root.$broadcast( this.state.profileState, profileData );

					this.props.scope.$broadcast( "profile-state-changed", this.state.profileState, this.state.componentState );
				}
			},

			"componentDidMount": function componentDidMount( ){
				this.props.scope.$root.$broadcast( "crime-profile-rendered" );	
			}
		} );

		return {
			"restrict": "EA",
			"scope": true,
			"link": function onLink( scope, element, attributeSet ){
				PageFlow( scope, element, "profile" );

				scope.reflow( "hidden", "profile-minified", "profile-standby" );
				
				scope.$on( "show-minified-profile",
					function onShowMinifiedProfile( ){
						scope.reflow( "shown", "profile-minified" );
					} );

				scope.$on( "show-expanded-profile",
					function onShowMap( ){
						scope.reflow( "shown", "profile-expanded" );
					} );

				scope.$on( "show-profile",
					function onShowProfile( ){
						scope.removeFlow( "hidden" ).applyFlow( "shown" );
					} );

				scope.$on( "hide-profile",
					function onHideMap( ){
						scope.reflow( "hidden", "profile-minified" );
					} );

				scope.$on( "profile-state-changed",
					function onProfileStateChanged( event, profileState, componentState ){
						scope.toggleFlow( "profile-*", profileState, componentState );
					} );

				React.renderComponent( <crimeProfile scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );