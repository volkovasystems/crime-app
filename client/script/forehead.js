angular.module( "Forehead", [ "Event", "PageFlow" ] )
	
	.factory( "Forehead", [
		function factory( ){
			var Forehead = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						React.render( <Forehead scope={ scope } />, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"componentState": "forehead-normal"
					};
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;
				},

				"render": function onRender( ){
					var componentState = this.state.componentState;

					return ( 
						<div 
							className={ [
								"forehead-container",
								componentState
							].join( " " ) }>
						</div>
					);
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.broadcast( "forehead-rendered" );	
				}
			} );

			return Forehead;
		}
	] )

	.directive( "forehead", [
		"PageFlow",
		"Event",
		"Forehead",
		function directive( PageFlow, Event, Forehead ){
			return {
				"restrict": "EA",
				"scope": true,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "forehead" );

					scope.on( "show-default-page",
						function onShowDefaultPage( ){
							scope.broadcast( "show-normal-forehead" );
						} );

					scope.on( "show-normal-forehead",
						function onShowNormalForehead( ){
							scope.showPage( )
								.toggleFlow( "!forehead-expanded", "forehead-normal" );
						} );

					scope.on( "show-expanded-forehead",
						function onShowExpandedForehead( ){
							scope.showPage( )
								.toggleFlow( "!forehead-normal", "forehead-expanded" );
						} );

					scope.on( "show-forehead",
						function onShowForehead( ){
							scope.showPage( );
						} );

					scope.on( "hide-forehead",
						function onHideForehead( ){
							scope.hidePage( );
						} );

					scope.publish( "hide-forehead" );

					Forehead.attach( scope, element );
				}
			};
		}
	] );