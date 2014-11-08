angular.module( "Control", [ "PageFlow", "Event" ] )
	.factory( "Control", [
		function factory( ){
			var Control = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						React.render( <Control scope={ scope } />, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"controlList": [ ]
					};
				},

				"onEachControlItem": function onEachControlItem( controlData ){

				},

				"onEachControlGroup": function onEachControlGroup( controlData ){

				},

				"onEachControl": function onEachControl( ){
					if( controlData.isControlGroup ){
						return self.onEachControlGroup( controlData );
					}
					
					return self.onEachControlItem( controlData );
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){

				},

				"componentWillMount": function componentWillMount( ){

				},

				"render": function render( ){
					var self = this;
					
					var controlList = this.state.controlList;
					
					return (
						<div
							className={ [
								"control-container"
							].join( " " ) }>
							{ 
								controlList.map( this.onEachControl );
							}
						</div>
					);
				},

				"componentDidUpdate": function componentDidUpdate( ){

				},

				"componentDidMount": function componentDidMount( ){

				}
			} );

			return Control;
		}
	] )
	.directive( "control", [
		"PageFlow",
		"Event",
		"Control",
		function directive( PageFlow, Event, Control ){
			return {
				"restrict": "EA",
				"scope": true,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "control" );					

					scope.hidePage( );

					scope.on( "show-control",
						function onShowControl( ){
							scope.showPage( );
						} );

					scope.on( "hide-control",
						function onHideControl( ){
							scope.hidePage( );
						} );

					Control.attach( scope, element );
				}
			};
		}
	] );