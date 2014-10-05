Crime.directive( "crimeProfile", [
	"PageFlow",
	function directive( PageFlow ){
		var crimeProfile = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"profileName": "",
					"profileLink": "",
					"profileImage": "./image/profile.png",
					"imageScale": 64
				};
			},

			"onClick": function onClick( ){

			},

			"componentWillMount": function componentWillMount( ){
				var self = this;

				this.props.scope.$on( "profile-data", 
					function onProfileData( event, profileData ){
						self.setState( {
							"profileName": profileData.profileName,
							"profileLink": profileData.profileLink,
							"profileImage": profileData.profileImage
						} );
					} );
			},

			"render": function onRender( ){
				return ( 
					<div className="crime-profile-container">
						<div className="profile-helper-container col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-xs-12">
							<div className="media profile-data-container col-md-8 col-md-offset-2">
								<button 
									type="button" 
									className="close"
									onClick={ this.onClick }>
									<span aria-hidden="true">{ '\u00d7' }</span>
									<span className="sr-only">Close</span>
								</button>

								<a className="pull-left" href="#">
									<img 
										className="media-object profile-image" 
										src={ this.state.profileImage }
										width={ this.state.imageScale } />
								</a>

								<div className="media-body">
									<h4 className="media-heading profile-name">{ this.state.profileName }</h4>

									<a className="profile-link" href={ this.state.profileLink }>
										<h5>Go to Profile Page</h5>
									</a>
								</div>
							</div>
						</div>
					</div>
				);
			},

			"componentDidMount": function componentDidMount( ){
				this.props.scope.$root.$broadcast( "crime-profile-rendered" );	
			}
		} );

		return {
			"restrict": "EA",
			"scope": true,
			"link": function onLink( scope, element, attributeSet ){
				PageFlow( scope, element );

				scope.wholePageUp( );

				scope.$on( "show-facebook-profile",
					function onShowMap( ){
						scope.wholePageCenter( );
					} );

				scope.$on( "hide-facebook-profile",
					function onHideMap( ){
						scope.wholePageUp( );
					} );

				React.renderComponent( <crimeProfile scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );