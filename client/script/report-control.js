angular.module( "ReportControl", [ "Event", "PageFlow" ] )

	.constant( "REPORT_CONTROL_LABEL", labelData.REPORT_CONTROL_LABEL )

	.factory( "ReportControl", [
		"REPORT_CONTROL_LABEL",
		function factory( REPORT_CONTROL_LABEL ){
			var ReportControl = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						React.render( <ReportControl scope={ scope } />, container[ 0 ] );

						return this;
					}
				},

				"onClickReport": function onClickReport( ){
					this.scope.publish( "report-control-clicked:report" );
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){

				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					return; //: @template: template/report-control.html
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.publish( "report-control-rendered" );
				}
			} );

			return ReportControl
		}
	] )

	.directive( "reportControl", [
		"Event",
		"PageFlow",
		"ReportControl",
		function directive( Event, PageFlow, ReportControl ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "report-control overflow" );

					scope.on( "show-report-control",
						function onShowReportControl( ){
							scope.showPage( );
						} );

					scope.on( "hide-report-control",
						function onHideReportControl( ){
							scope.hidePage( );
						} );
					
					scope.publish( "hide-report-control" );

					ReportControl
						.attach( scope, element );
				}
			}
		}
	] );