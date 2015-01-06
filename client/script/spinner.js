angular
	.module( "Spinner", [ "Event", "PageFlow" ] )

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

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					var namespace = this.props.namespace;

					this.scope.on( "show-spinner",
						function onShowSpinner( thisNamespace ){
							if( thisNamespace == namespace ){
								$( ".spinner-component", self.getDOMNode( ) ).spin( );
							}
						} );

					this.scope.on( "hide-spinner",
						function onShowSpinner( thisNamespace ){
							if( thisNamespace == namespace ){
								$( ".spinner-component", self.getDOMNode( ) ).spin( false );
							}
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					var namespace = this.props.namespace;

					return; //: @template: template/spinner.html
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.publish( "spinner-rendered" );	
				}
			} );

			return Spinner;
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
					function onShowSpinner( thisNamespace ){
						if( namespace == thisNamespace ){
							scope.showPage( );
						}
					} );

				scope.on( "hide-spinner",
					function onHideSpinner( thisNamespace ){
						if( namespace == thisNamespace ){
							scope.hidePage( );	
						}
					} );

				scope.publish( "hide-spinner", namespace );

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
						"namespace": scope.namespace || attributeSet.namespace,
						"embedState": "no-embed"
					} );
				}
			}
		}
	] );