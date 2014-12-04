angular.module( "ProfileSetting", [ "Event", "PageFlow" ] )
	
	.constant( "NAME_LABEL", labelData.NAME_LABEL )

	.constant( "NAME_PLACEHOLDER", labelData.NAME_PLACEHOLDER )

	.constant( "EMAIL_LABEL", labelData.EMAIL_LABEL )

	.constant( "EMAIL_PLACEHOLDER", labelData.EMAIL_PLACEHOLDER )

	.constant( "UPDATE_BUTTON_LABEL", labelData.UPDATE_BUTTON_LABEL )

	.constant( "CANCEL_BUTTON_LABEL", labelData.CANCEL_BUTTON_LABEL )

	.constant( "USER_AVATAR_ALTERNATIVE", labelData.USER_AVATAR_ALTERNATIVE )

	.constant( "CHANGE_AVATAR_LABEL", labelData.CHANGE_AVATAR_LABEL )
	
	.factory( "ProfileSetting", [
		"NAME_LABEL",
		"NAME_PLACEHOLDER",
		"EMAIL_LABEL",
		"EMAIL_PLACEHOLDER",
		"UPDATE_BUTTON_LABEL",
		"CANCEL_BUTTON_LABEL",
		"USER_AVATAR_ALTERNATIVE",
		"CHANGE_AVATAR_LABEL",
		function factory( 
			NAME_LABEL,
			NAME_PLACEHOLDER,
			EMAIL_LABEL,
			EMAIL_PLACEHOLDER,
			UPDATE_BUTTON_LABEL,
			CANCEL_BUTTON_LABEL,
			USER_AVATAR_ALTERNATIVE,
			CHANGE_AVATAR_LABEL
		){
			var ProfileSetting = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						React.render( <ProfileSetting scope={ scope } />, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"displayName": "",
						"userEMail": "",
						"userAvatar": "../image/profile.png",
						
						"profileSettingState": "profile-setting-default"
					};
				},

				"onClickCloseProfileSetting": function onClickCloseProfileSetting( ){
					this.scope.publish( "close-profile-setting" );
				},

				"onClickUpdate": function onClickUpdate( event ){
					this.scope.publish( "update-profile-data" );
				},

				"onClickCancel": function onClickCancel( event ){
					this.scope.publish( "close-profile-setting" );
				},

				"onChangeDisplayName": function onChangeDisplayName( event ){
					var displayName = event.target.value;

					this.setState( {
						"displayName": displayName
					} );
				},

				"onChangeEMail": function onChangeEMail( event ){
					var userEMail = event.target.value;

					this.setState( {
						"userEMail": userEMail
					} );
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;
					
					this.scope.on( "set-profile-setting",
						function onSetProfileSetting( profileData ){
							self.setState( {
								"displayName": profileData.userDisplayName || profileData.userProfileName,
								"userEMail": profileData.userEMail || profileData.userAccountEMail,
								"userAvatar": profileData.userAvatar || profileData.userProfileImageURL
							} );
						} );

					this.scope.on( "clear-profile-setting",
						function onSetProfileSetting( profileData ){
							self.setState( {
								"displayName": "",
								"userEMail": "",
								"userAvatar": "../image/profile.png",
							} );
						} );

					this.scope.on( "get-profile-setting",
						function onGetProfileSetting( callback ){
							callback( null, {
								"displayName": self.state.displayName,
								"userEMail": self.state.userEMail
							} );
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					var displayName = this.state.displayName;

					var userEMail = this.state.userEMail;

					var userAvatar = this.state.userAvatar;
					
					var profileSettingState = this.state.profileSettingState;

					return; //: @template: template/profile-setting.html
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.broadcast( "profile-setting-rendered" );	
				}
			} );

			return ProfileSetting;
		}
	] )

	.factory( "attachProfileSetting", [
		"$rootScope",
		"Event",
		"PageFlow",
		"ProfileSetting",
		function factory( $rootScope, Event, PageFlow, ProfileSetting ){
			var attachProfileSetting = function attachProfileSetting( optionSet ){
				var element = optionSet.element;

				if( _.isEmpty( element ) || element.length == 0 ){
					throw new Error( "unable to attach component" );
				}

				var scope = optionSet.scope || $rootScope;

				scope = scope.$new( true );

				Event( scope );

				var pageFlow = PageFlow( scope, element, "profile-setting" );

				if( optionSet.embedState != "no-embed" ){
					pageFlow.namespaceList = _.without( pageFlow.namespaceList, "page" );
				}

				scope.on( "show-profile-setting",
					function onShowProfileSetting( ){
						scope.showPage( );
					} );

				scope.on( "hide-profile-setting",
					function onHideProfileSetting( ){
						scope.hidePage( );
					} );

				scope.publish( "hide-profile-setting" );

				ProfileSetting.attach( scope, element );
			};

			return attachProfileSetting;
		}
	] )

	.directive( "profileSetting", [
		"attachProfileSetting",
		function directive( attachProfileSetting ){
			return {
				"restrict": "EA",
				"scope": true,
				"link": function onLink( scope, element, attributeSet ){
					attachProfileSetting( {
						"scope": scope,
						"element": element,
						"attributeSet": attributeSet,
						"embedState": "no-embed"
					} );
				}
			};
		}
	] );