angular.module( "LocateControl", [ "Event", "PageFlow" ] )

	.factory( "LocateControl", [
		function factory( ){
			var LocateControl = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						React.render( <LocateControl scope={ scope } />, container[ 0 ] );

						return this;
					}
				},

				"onClickLocate": function onClickLocate( ){ 
					this.scope.publish( "locate-control-click:locate" );
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){

				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					return; //: @template: template/locate-control.html
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.publish( "locate-control-rendered" );
				}
			} );

			return LocateControl;
		}
	] )

	.directive( "locateControl", [
		"Event",
		"PageFlow",
		"LocateControl",
		function directive( Event, PageFlow, LocateControl ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "locate-control overflow" );

					scope.on( "show-locate-control",
						function onShowLocateControl( ){
							scope.showPage( );
						} );

					scope.on( "hide-locate-control",
						function onHideLocateControl( ){
							scope.hidePage( );
						} );
					
					scope.publish( "hide-locate-control" );

					LocateControl
						.attach( scope, element );
				}
			}
		}
	] );