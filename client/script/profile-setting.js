angular.module( "ProfileSetting", [ "Event", "PageFlow", "Icon" ] )
	
	.constant( "NAME_LABEL", labelData.NAME_LABEL )

	.constant( "NAME_PLACEHOLDER", labelData.NAME_PLACEHOLDER )

	.constant( "EMAIL_LABEL", labelData.EMAIL_LABEL )

	.constant( "EMAIL_PLACEHOLDER", labelData.EMAIL_PLACEHOLDER )

	.constant( "UPDATE_LABEL", labelData.UPDATE_LABEL )

	.constant( "CANCEL_LABEL", labelData.CANCEL_LABEL )

	.constant( "USER_AVATAR_ALTERNATIVE", labelData.USER_AVATAR_ALTERNATIVE )

	.constant( "CHANGE_AVATAR_LABEL", labelData.CHANGE_AVATAR_LABEL )
	
	.factory( "ProfileSetting", [
		"Icon",
		"NAME_LABEL",
		"NAME_PLACEHOLDER",
		"EMAIL_LABEL",
		"EMAIL_PLACEHOLDER",
		"UPDATE_LABEL",
		"CANCEL_LABEL",
		"USER_AVATAR_ALTERNATIVE",
		"CHANGE_AVATAR_LABEL",
		function factory( 
			Icon,
			NAME_LABEL,
			NAME_PLACEHOLDER,
			EMAIL_LABEL,
			EMAIL_PLACEHOLDER,
			UPDATE_LABEL,
			CANCEL_LABEL,
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
						
						"profileSettingState": "profile-setting-default",
						"componentState": "profile-setting-hidden"
					};
				},

				"onClickCloseProfileSetting": function onClickCloseProfileSetting( ){
					this.scope.publish( "close-profile-setting" );
				},

				"onClickUpdate": function onClickUpdate( event ){
					this.scope.publish( "update-profile-data", {
						"displayName": this.state.displayName,
						"userEMail": this.state.userEMail
					} );
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

					this.scope.on( "show-profile-setting",
						function onShowProfileSetting( ){
							self.setState( {
								"componentState": "profile-setting-shown"
							} );
						} );

					this.scope.on( "hide-profile-setting",
						function onHideProfileSetting( ){
							self.setState( {
								"componentState": "profile-setting-hidden"
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

					var componentState = this.state.componentState;

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
				var scope = optionSet.scope || $rootScope;

				var element = optionSet.element;

				if( _.isEmpty( element ) || element.length == 0 ){
					throw new Error( "unable to attach component" );
				}

				Event( scope );

				PageFlow( scope, element, "profile-setting" );

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
						"attributeSet": attributeSet
					} );
				}
			};
		}
	] );