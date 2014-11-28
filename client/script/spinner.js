angular.module( "Spinner", [ "Event", "PageFlow" ] )
	.factory( "Spinner", [
		function factory( ){
			var Spinner = React.createClass( {
				"statics": {
					"attach": function attach( scope, container, namespace ){
						var spinnerComponent = (
							<Spinner 
								scope={ scope } 
								namespace={ namespace } />
						);
						
						React.render( spinnerComponent, container[ 0 ] );

						return this;
					},
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;
				},

				"render": function onRender( ){
					var namespace = this.props.namespace;

					return; //: @template: template/spinner.html
				},

				"componentDidMount": function componentDidMount( ){
					var namespace = this.props.namespace;

					var spinnerReference = [ 
						[ ".", namespace ].join( "" ),
						".spinner-component" 
					].join( " " );

					$( spinnerReference ).spin( false );

					this.scope.publish( "spinner-rendered" );	
				}
			} );
		}
	] )

	.factory( "attachSpinner", [
		"$rootScope",
		"Event",
		"PageFlow",
		"Spinner",
		function factory( $rootScope, Event, PageFlow, Spinner ){
			var attachSpinner = function attachSpinner( optionSet ){
				var element = optionSet.element;

				if( _.isEmpty( element ) || element.length == 0 ){
					throw new Error( "unable to attach component" );
				}

				var scope = optionSet.scope || $rootScope;

				var namespace = optionSet.namespace;

				Event( scope );

				PageFlow( scope, element, "spinner" );

				scope.on( "show-spinner",
					function onShowSpinner( ){
						scope.showPage( );
					} );

				scope.on( "hide-spinner",
					function onHideSpinner( ){
						scope.hidePage( );
					} );

				Spinner.attach( scope, element, namespace );
			};

			return attachSpinner;
		}
	] )

	.directive( "spinner", [
		"attachSpinner",
		function directive( attachSpinner ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					attachSpinner( {
						"scope": scope,
						"element": element,
						"attributeSet": attributeSet,
						"namespace": scope.namespace || attributeSet.namespace
					} );
				}
			}
		}
	] );