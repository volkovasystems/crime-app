angular.module( "ZoomControl", [ "Event", "PageFlow" ] )

	.factory( "ZoomControl", [
		function factory( ){
			var ZoomControl = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						React.render( <ZoomControl scope={ scope } />, container[ 0 ] );

						return this;
					}
				},

				"onClickZoomIn": function onClickZoomIn( ){
					this.scope.publish( "zoom-control-click:zoom-in" );
				},

				"onClickZoomOut": function onClickZoomOut( ){ 
					this.scope.publish( "zoom-control-click:zoom-out" );
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){

				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					return; //: @template: template/zoom-control.html
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.publish( "zoom-control-rendered" );
				}
			} );

			return ZoomControl
		}
	] )

	.directive( "zoomControl", [
		"Event",
		"PageFlow",
		"ZoomControl",
		function directive( Event, PageFlow, ZoomControl ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "zoom-control" );

					scope.on( "show-zoom-control",
						function onShowZoomControl( ){
							scope.showPage( );
						} );

					scope.on( "hide-zoom-control",
						function onHideZoomControl( ){
							scope.hidePage( );
						} );
					
					scope.publish( "hide-zoom-control" );

					ZoomControl
						.attach( scope, element );
				}
			}
		}
	] );