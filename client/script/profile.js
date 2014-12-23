angular
	
	.module( "Profile", [ "Event", "PageFlow" ] )

	.constant( "FACEBOOK_PROFILE_TYPE", "facebook" )
	
	.factory( "Profile", [
		"FACEBOOK_PROFILE_TYPE",
		function factory( 
			FACEBOOK_PROFILE_TYPE 
		){
			var Profile = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						React.render( <Profile scope={ scope } />, container[ 0 ] );

						return this;
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
											profileData.profileEMail = response.email;

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
								var formattedProfileData = {
									"profileName": profileData.profileName,
									"profileURL": profileData.profileURL,
									"profileImage": profileData.profileImage,
									"profileEMail": profileData.profileEMail
								};

								callback( error, formattedProfileData, responseList );
							} );
					},

					"getBasicProfileData": function getBasicProfileData( profileType, callback ){
						callback = callback || function callback( ){ };

						switch( profileType ){
							case FACEBOOK_PROFILE_TYPE:
								this.getBasicProfileDataFromFacebook( callback );
								break;
						}
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"profileName": "",
						"profileURL": "",
						"profileImage": staticData.DEFAULT_PROFILE_IMAGE_SOURCE,
						"profileEMail": "",

						"displayName": "",
						"userEMail": "",
						"userAvatar": "",
						
						"profileType": FACEBOOK_PROFILE_TYPE,
						
						"profileState": "profile-empty"
					};
				},

				"onClickCloseProfile": function onClickCloseProfile( ){
					this.scope.publish( "close-profile" );
				},

				"initiateBasicProfileDataRetrieval": function initiateBasicProfileDataRetrieval( profileType ){
					if( this.state.profileState == "profile-ready" ){
						return;
					}

					var self = this;
					this.setState( {
							"profileType": profileType,
							"profileState": "profile-processing"
						},
						function onStateChanged( ){
							Profile.getBasicProfileData( self.state.profileType,
								function onResult( error, profileData, responseList ){
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
											"profileEMail": profileData.profileEMail,
											"profileState": "profile-ready"
										} );
									}
								} );
						} );
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;
					
					this.scope.on( "initiate-basic-profile-data-retrieval",
						function onInitiateBasicProfileDataRetrieval( profileType ){
							self.initiateBasicProfileDataRetrieval( profileType );
						} );

					this.scope.on( "get-basic-profile-data",
						function onGetBasicProfileData( callback ){
							if( self.state.profileState == "profile-ready" ){
								var profileData = {
									"profileName": self.state.profileName,
									"profileURL": self.state.profileURL,
									"profileImage": self.state.profileImage,
									"profileEMail": self.state.profileEMail
								};

								callback( null, profileData );

							}else{
								Profile.getBasicProfileData( self.state.profileType, callback );
							}
						} );

					this.scope.on( "set-basic-profile-data",
						function onSetBasicProfileData( profileData ){
							self.setState( {
								"profileName": profileData.profileName,
								"profileURL": profileData.profileURL,
								"profileImage": profileData.profileImage,
								"profileEMail": profileData.profileEMail,
								"profileState": "profile-ready"
							} );
						} );

					this.scope.on( "set-profile-data",
						function onSetProfileData( userData ){
							self.setState( {
								"displayName": userData.userDisplayName,
								"userEMail": userData.userEMail,
								"userAvatar": userData.userAvatar
							} );
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					var profileName = this.state.displayName || this.state.profileName;

					var profileEMail = this.state.userEMail || this.state.profileEMail;

					var profileURL = this.state.profileURL;

					var profileImage = this.state.userAvatar || this.state.profileImage;

					var profileType = this.state.profileType;
					
					var profileState = this.state.profileState;

					return; //: @template: template/profile.html
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					if( this.state.profileState != prevState.profileState ){
						if( this.state.profileState == "profile-ready" ){
							var profileData = {
								"profileName": this.state.profileName,
								"profileURL": this.state.profileURL,
								"profileImage": this.state.profileImage,
								"profileEMail": this.state.profileEMail,
								"profileState": this.state.profileState
							};

							this.scope.broadcast( this.state.profileState, profileData );
						
						}else{
							this.scope.broadcast( this.state.profileState );
						}

						this.scope.broadcast( "profile-state-changed", this.state.profileState );
					}
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.broadcast( "profile-rendered" );	
				}
			} );

			return Profile;
		}
	] )

	.factory( "attachProfile", [
		"$rootScope",
		"Event",
		"PageFlow",
		"Profile",
		function factory( $rootScope, Event, PageFlow, Profile ){
			var attachProfile = function attachProfile( optionSet ){
				var element = optionSet.element;

				if( _.isEmpty( element ) || element.length == 0 ){
					throw new Error( "unable to attach component" );
				}

				var scope = optionSet.scope || $rootScope;

				scope = scope.$new( true );

				Event( scope );

				var pageFlow = PageFlow( scope, element, "profile" );

				if( optionSet.embedState != "no-embed" ){
					pageFlow.namespaceList = _.without( pageFlow.namespaceList, "page" );
				}

				scope.on( "show-profile",
					function onShowProfile( ){
						scope.showPage( );
					} );

				scope.on( "hide-profile",
					function onHideProfile( ){
						scope.hidePage( );
					} );

				scope.on( "profile-state-changed",
					function onProfileStateChanged( profileState ){
						scope.toggleFlow( "profile-*", profileState );

						scope.publish( profileState );
					} );

				scope.publish( "hide-profile" );

				Profile.attach( scope, element );
			};

			return attachProfile;
		}
	] )

	.directive( "profile", [
		"attachProfile",
		function directive( attachProfile ){
			return {
				"restrict": "EA",
				"scope": true,
				"link": function onLink( scope, element, attributeSet ){
					attachProfile( {
						"scope": scope,
						"element": element,
						"attributeSet": attributeSet,
						"embedState": "no-embed"
					} );
				}
			};
		}
	] );