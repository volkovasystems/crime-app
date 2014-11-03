angular.module( "Control", [ "PageFlow", "Event" ] )
	.directive( "control", [
		"PageFlow",
		"Event",
		function directive( PageFlow, Event ){
			var control = React.createClass( {
				"getInitialState": function getInitialState( ){
					return {
						"controlList": [ ]
					};
				},

				"componentWillMount": function componentWillMount( ){

				},

				"render": function render( ){
					return (
						<div
							className={ [
								"control-container"
							].join( " " ) }>
						</div>
					);
				},

				"componentDidMount": function componentDidMount( ){

				}
			} );

			return {
				"restrict": "EA",
				"scope": true,
				"link": function onLink( scope, element, attributeSet ){
					PageFlow( scope, element, "control" );
					Event( scope );

					scope.hidePage( );

					scope.on( "show-control",
						function onShowControl( ){
							scope.showPage( );
						} );

					scope.on( "hide-control",
						function onHideControl( ){
							scope.hidePage( );
						} );

					React.renderComponent( <control scope={ scope } />, element[ 0 ] );
				}
			};
		}
	] );