angular.module( "ConfirmLocationControl", [ "Event", "PageFlow" ] )

	.constant( "CONFIRM_LOCATION_CONTROL_LABEL", labelData.CONFIRM_LOCATION_CONTROL_LABEL )

	.factory( "ConfirmLocationControl", [
		"CONFIRM_LOCATION_CONTROL_LABEL",
		function factory( CONFIRM_LOCATION_CONTROL_LABEL ){
			var ConfirmLocationControl = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						React.render( <ConfirmLocationControl scope={ scope } />, container[ 0 ] );

						return this;
					}
				},

				"onClickConfirmLocation": function onClickReport( ){
					this.scope.publish( "confirm-location-control-click:confirm-location" );
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){

				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					return; //: @template: template/confirm-location-control.html
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.publish( "confirm-location-control-rendered" );
				}
			} );

			return ConfirmLocationControl
		}
	] )

	.directive( "confirmLocationControl", [
		"Event",
		"PageFlow",
		"ConfirmLocationControl",
		function directive( Event, PageFlow, ConfirmLocationControl ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "confirm-location-control overflow" );

					scope.on( "show-confirm-location-control",
						function onShowConfirmLocationControl( ){
							scope.showPage( );
						} );

					scope.on( "hide-confirm-location-control",
						function onHideConfirmLocationControl( ){
							scope.hidePage( );
						} );
					
					scope.publish( "hide-confirm-location-control" );

					ConfirmLocationControl
						.attach( scope, element );
				}
			}
		}
	] );