angular
	.module( "ReportTable", [ 
		"Event", 
		"PageFlow"
	] )

	.value( "REPORT_HEADER_LABEL", "report a crime" )

	.factory (  "ReportTableList" , [
		"Event",
		function factory ( Event ) {
			var ReportTableList = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){

						React.render( <ReportTableList scope={ scope } />, container[ 0 ] );

						return this;
					}					
				},

				"getInitialState": function getInitialState( ){
					return {
						
					};
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
					
					};
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					
				},

				"componentWillMount": function componentWillMount( ){										
					this.scope = this.props.report;

					this.parentScope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"onReportStateAccept": function onReportStateAccept ( event ) {
					var state = $( event.currentTarget ).attr( "value" );

					if( state != "approved" ){
						this.onReportStateSet( "approved" );
					}
				},

				"onReportStateReject": function onReportStateReject ( event ) {
					var state = $( event.currentTarget ).attr( "value" );

					if( state != "rejected" ){
						this.onReportStateSet( "rejected" );
					}
				},

				"onReportStateSet": function onReportStateSet ( state ) {					
					this.scope.reportState = state;

					this.setState( {
						report: this.scope
					} );
				},

				"onChangeHandler": function onChangeHandler ( event ) {
					this.scope[ event.target.name ] = event.target.value;

					this.setState( {
						report: this.scope
					} );
				},

				"updateReport": function updateReport ( ) {	
					if( !_.isEmpty( this.state.report ) ){
						this.parentScope.publish( "update-report-data" , this.state.report );

						this.setState( {
							report: null
						} );	
					}			
				},

				"render": function onRender( ){
					var reportData = this.state.report || this.scope;

					var reportTimestamp = reportData.reportTimestamp.toString( );

					var reportDate = moment( reportTimestamp ).format( "MMMM DD, YYYY" );

					var reportTime = moment( reportTimestamp ).format( "hh:mm A" );

					return; //: @template: template/report-table-item.html
				}
			} );

			return ReportTableList;
		}
	])
	
	.factory( "ReportTable", [
		"REPORT_HEADER_LABEL",
		"ReportTableList",
		function factory( REPORT_HEADER_LABEL , ReportTableList ){
			var ReportTable = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){

						React.render( <ReportTable scope={ scope }/>, container[ 0 ] );

						return this;
					}					
				},

				"getInitialState": function getInitialState( ){
					return {
						"reportList": [ ]
					};
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"reportList": [ ]
					};
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;					

					this.scope.on( "set-report-table-list",
						function onSetReportData( reportList ){							

							self.setState( {
								"reportList": reportList
							} );
						} );
								
				},

				"onClickCloseReportTable": function onClickCloseReportTable( event ){
					this.scope.publish( "hide-report-table" );
					
					this.scope.publish( "show-control" );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;					

					this.attachAllComponentEventListener( );
				},

				"onEachReportItem": function onEachReportItem( reportData ){
					return (
						<ReportTableList scope={this.scope} report={reportData} />
					);
				},

				"render": function onRender( ){
					var reportList = this.state.reportList;

					return; //: @template: template/report-table.html
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.publish( "report-table-rendered" );
				}
			} );

			return ReportTable;
		}
	] )
	
	.directive( "reportTable", [
		"Event",
		"PageFlow",
		"ReportTable",
		function directive( Event, PageFlow, ReportTable ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "report-table overflow" );

					scope.on( "show-report-table",
						function onShowReportTable( ){
							scope.showPage( );
						} );

					scope.on( "hide-report-table",
						function onHideReportTable( ){
							scope.hidePage( );
						} );

					scope.publish( "hide-report-table" );

					ReportTable
						.attach( scope, element );
				}
			};
		}
	] );