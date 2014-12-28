angular

	.module( "ReportSharing", [ "Event", "PageFlow", "ProgressBar" ] )

	.factory( "ReportSharing", [
		function factory( ){
			var ReportSharing = React.createClass( {
				"statics": {
					"attach": function attach( scope, container, optionSet ){
						var reportSharingComponent = (
							<ReportSharing 
								scope={ scope }
								namespace={ optionSet.namespace } />
						);

						React.render( reportSharingComponent, container[ 0 ] );

						return this;
					}
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"namespace": ""
					};
				},

				"getInitialState": function getInitialState( ){
					return {
						"facebookShareURL": "#"
					};
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "set-facebook-share-url",
						function onSetFacebookShareURL( namespace, facebookShareURL ){
							if( self.props.namespace == namespace ){
								self.setState( {
									"facebookShareURL": facebookShareURL
								} );
							}
						} );

					this.scope.on( "initiate-report-sharing",
						function onInitiateReportSharing( namespace ){
							if( self.props.namespace == namespace ){
								self.scope.publish( "initiate-facebook-sharing", namespace );
							}
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					var facebookShareURL = this.state.facebookShareURL;

					return; //: @template: template/report-sharing.html	
				},

				"componentDidUpdate": function onComponentDidUpdate( prevProps, prevState ){
					if( prevState.facebookShareURL != this.state.facebookShareURL ){
						FB.init( {
							"xfbml": true,
							"cookie": true,
							"version": "v2.2"
						} );
					}
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.publish( "report-sharing-rendered" );	
				}
			} );

			return ReportSharing;
		}
	] )

	.factory( "attachReportSharing", [
		"$rootScope",
		"Event",
		"PageFlow",
		"ReportSharing",
		function factory( 
			$rootScope,
			Event,
			PageFlow,
			ReportSharing
		){
			var attachReportSharing = function attachReportSharing( optionSet ){
				var element = optionSet.element;

				if( _.isEmpty( element ) || element.length == 0 ){
					throw new Error( "unable to attach component" );
				}

				var scope = optionSet.scope || $rootScope;

				if( optionSet.embedState != "no-embed" ){
					scope = scope.$new( true );
				}

				scope.namespace = optionSet.namespace;

				Event( scope );

				var pageFlow = PageFlow( scope, element, "report-sharing overflow" );

				if( optionSet.embedState != "no-embed" ){
					pageFlow.namespaceList = _.without( pageFlow.namespaceList, "page" );
				}

				scope.on( "show-report-sharing",
					function onShowReportSharing( namespace ){
						if( optionSet.namespace == namespace ){
							scope.showPage( );	
						}
					} );

				scope.on( "hide-report-sharing",
					function onHideReportSharing( namespace ){
						if( optionSet.namespace == namespace ){
							scope.hidePage( );
						}
					} );

				scope.publish( "hide-report-sharing", optionSet.namespace );

				ReportSharing.attach( scope, element, {
					"namespace": optionSet.namespace
				} );
			};

			return attachReportSharing;
		}
	] )

	.directive( "reportSharing", [
		"attachReportSharing",
		function directive( attachReportSharing ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					attachReportSharing( {
						"scope": scope,
						"element": element,
						"attributeSet": attributeSet,
						"embedState": "no-embed"
					} );
				}
			};
		}
	] );