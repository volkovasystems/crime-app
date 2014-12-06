angular.module( "ReportFinal", [ "Event", "PageFlow" ] )
	
	.constant( "REPORT_HEADER_TITLE", labelData.REPORT_HEADER_TITLE )

	.constant( "SPECIFY_CATEGORY_PROGRESS_LABEL", labelData.SPECIFY_CATEGORY_PROGRESS_LABEL )

	.constant( "INCIDENT_DETAIL_PROGRESS_LABEL", labelData.INCIDENT_DETAIL_PROGRESS_LABEL )

	.constant( "REPORT_FINAL_PROGRESS_LABEL", labelData.REPORT_FINAL_PROGRESS_LABEL )

	.constant( "THANK_SUBMISSION_PHRASE", labelData.THANK_SUBMISSION_PHRASE )

	.constant( "VERIFY_SUBMISSION_PHRASE", labelData.VERIFY_SUBMISSION_PHRASE )

	.constant( "MY_REPORT_BUTTON_LABEL", labelData.MY_REPORT_BUTTON_LABEL )

	.constant( "CLOSE_BUTTON_LABEL", labelData.CLOSE_BUTTON_LABEL )

	.factory( "ReportFinal", [
		"REPORT_HEADER_TITLE",
		"SPECIFY_CATEGORY_PROGRESS_LABEL",
		"INCIDENT_DETAIL_PROGRESS_LABEL",
		"REPORT_FINAL_PROGRESS_LABEL",
		"MY_REPORT_BUTTON_LABEL",
		"CLOSE_BUTTON_LABEL",
		"THANK_SUBMISSION_PHRASE",
		"VERIFY_SUBMISSION_PHRASE",
		function factory( 
			REPORT_HEADER_TITLE,
			SPECIFY_CATEGORY_PROGRESS_LABEL,
			INCIDENT_DETAIL_PROGRESS_LABEL,
			REPORT_FINAL_PROGRESS_LABEL,
			MY_REPORT_BUTTON_LABEL,
			CLOSE_BUTTON_LABEL,
			THANK_SUBMISSION_PHRASE,
			VERIFY_SUBMISSION_PHRASE
		){
			var ReportFinal = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						var reportFinalComponent = (
							<ReportFinal 
								scope={ scope } />
						)

						React.render( reportFinalComponent, container[ 0 ] );

						return this;
					}
				},

				"onClickMyReport": function onClickMyReport( ){
					this.scope.publish( "open-my-report" );
				},

				"onClickCloseReportFinal": function onClickCloseReportFinal( ){
					this.scope.publish( "close-report-final" );
				},

				"componentWillUpdate": function componentWillUpdate( ){

				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					return; //: @template: template/report-final.html
				},

				"componentDidUpdate": function componentDidUpdate( ){

				},

				"componentDidMount": function componentDidMount( ){
					this.scope.publish( "report-final-rendered" );
				}
			} );

			return ReportFinal;
		}
	] )

	.factory( "attachReportFinal", [
		"$rootScope",
		"Event",
		"PageFlow",
		"ReportFinal",
		function factory( $rootScope, Event, PageFlow, ReportFinal ){
			var attachReportFinal = function attachReportFinal( optionSet ){
				var element = optionSet.element;

				if( _.isEmpty( element ) || element.length == 0 ){
					throw new Error( "unable to attach component" );
				}

				var scope = optionSet.scope || $rootScope;

				scope = scope.$new( true );

				Event( scope );

				var pageFlow = PageFlow( scope, element, "report-final overflow" );

				if( optionSet.embedState != "no-embed" ){
					pageFlow.namespaceList = _.without( pageFlow.namespaceList, "page" );
				}

				scope.on( "show-report-final",
					function onShowReportFinal( ){
						scope.showPage( );
					} );

				scope.on( "hide-report-final",
					function onHideReportFinal( ){
						scope.hidePage( );
					} );

				scope.publish( "hide-report-final" );

				ReportFinal.attach( scope, element );
			};

			return attachReportFinal;
		}
	] )

	.directive( "reportFinal", [
		"attachReportFinal",
		function directive( attachReportFinal ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					attachReportFinal( {
						"scope": scope,
						"element": element,
						"attributeSet": attributeSet,
						"embedState": "no-embed"
					} );
				}
			}
		}
	] )