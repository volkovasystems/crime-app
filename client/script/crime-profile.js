Crime.directive( "crimeProfile", [
	"PageFlow",
	function directive( PageFlow ){
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

			"onClickCloseProfile": function onClickCloseProfile( event ){

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
								"profile-data-container",
								"media",
								"col-md-8",
								"col-md-offset-2",
								componentState,
								profileState
							].join( " " ) }>

							<a 
								className={ [
									"profile-image",
									"action-element",
									"pull-left",
									componentState,
									profileState
								].join( " " ) } 
								href={ [ 
									"#", 
									profileState 
								].join( "/" ) }>
								<img 
									className={ [
										"media-object",
										"img-circle"
									].join( " " ) } 
									src={ profileImage } />
							</a>

							<div 
								className={ [ 
									"profile-data",
									"media-body",
									componentState,
									profileState
								].join( " " ) }>

								<h4 
									className={ [
										"profile-name",
										"media-heading",
										profileState,
										componentState
									].join( " " ) }>
									{ profileName }
								</h4>

								<a 
									className={ [
										"profile-link",
										profileState,
										componentState
									].join( " " ) }
									href={ profileURL }>
									<h5>
										<span
											className={ [
												"entypo-social",
												profileType
											].join( " " ) }>
										</span>
										Go to Profile Page
									</h5>
								</a>
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

					if( this.state.profileState == "profile-ready" ){
						this.props.scope.$root.$broadcast( "show-profile" );
					}

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

				scope.$on( "show-viewed-profile",
					function onShowMap( ){
						scope.reflow( "shown", "profile-viewed" );
					} );

				scope.$on( "show-profile",
					function onShowProfile( ){
						scope.removeFlow( "hidden" ).applyFlow( "shown" );
					} );

				scope.$on( "hide-profile",
					function onHideMap( ){
						scope.reflow( "hidden", "profile-minified" );
					} );

				scope.$on( "profile-data",
					function onProfileData( ){
						scope.$root.$broadcast( "show-minified-profile" );
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