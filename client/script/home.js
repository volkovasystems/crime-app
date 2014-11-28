angular.module( "Home", [ "Event", "PageFlow" ] )

	.value( "APP_LOGO_IMAGE_SOURCE", "../image/empty.png" )

	.factory( "Home", [
		"APP_LOGO_IMAGE_SOURCE",
		function factory( APP_LOGO_IMAGE_SOURCE ){
			var Home = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						React.render( <Home scope={ scope } />, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"appLogoImageSource": APP_LOGO_IMAGE_SOURCE,
						"componentState": "home-standby"
					};
				},

				"setComponentState": function setComponentState( componentState ){
					this.setState( {
						"componentState": componentState
					} );
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "change-logo-image",
						function onChangeLogoImage( appLogoImageSource ){
							self.setState( {
								"appLogoImageSource": appLogoImageSource
							} );
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					var appLogoImageSource = this.state.appLogoImageSource;

					var componentState = this.state.componentState;

					return; //: @template: template/home.html
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.broadcast( "home-rendered" );	
				}
			} );

			return Home;
		}
	] )

	.directive( "home", [
		"PageFlow",
		"Event",
		"Home",
		function directive( PageFlow, Event, Home ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "home" );

					scope.on( "show-default-page",
						function onShowDefaultPage( ){
							scope.broadcast( "hide-home" );
						} );

					scope.on( "show-home",
						function onShowHome( ){
							scope.showPage( )
								.then.wholePage( )
								.then.wholePageCenter( );
						} );

					scope.on( "hide-home",
						function onHideHome( ){
							scope.hidePage( );
						} );

					scope.publish( "show-home" );

					Home.attach( scope, element );
				}
			};
		}
	] );
