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

				"onReportStateAccept": function onReportStateSet ( ) {
					this.onReportStateSet( "approved" );
				},

				"onReportStateReject": function onReportStateSet ( ) {
					this.onReportStateSet( "rejected" );
				},

				"onReportStateSet": function onReportStateSet ( state ) {					
					this.scope.reportState = state;
					this.setState( {
						report: this.scope
					} );
				},

				"onChangeHandler": function onChangeHandler ( evt ) {
					this.scope[ evt.target.name ] = evt.target.value;
					this.setState( {
						report: this.scope
					} );
				},

				"updateReport": function updateReport ( ) {										
					this.parentScope.publish( "update-report-data" , this.state.report );

					this.setState( {
						report: null
					} );					
				},

				"render": function onRender( ){
					var reportData = this.state.report || this.scope;

					return (
						<tr>
							<td>								
								<input type="text"
									   name="reportTitle"
									   value={reportData.reportTitle} 
									   onChange={this.onChangeHandler} />
							</td>
							<td>								
								<input type="text"
									   name="reportDescription"
									   value={reportData.reportDescription}
									   onChange={this.onChangeHandler} />
							</td>
							<td>
								<input type="button" 
									   disabled={ reportData.reportState == "approved" } 
									   name="reportStatusAccept" 
									   value="Approve"
									   onClick={ this.onReportStateAccept }
									   className={ [
									   		"btn",
											( reportData.state == "approved" ) ? "disabled" : 'enabled'
										].join( " " ) }/>
								<input type="button" 
									   disabled={ reportData.reportState == "rejected" } 
									   name="reportStatusReject" 
									   value="Reject" 
									   onClick={ this.onReportStateReject }
									   className={ [
									   		"btn",
											( reportData.state == "rejected" ) ? "disabled" : 'enabled'
										].join( " " ) } />

								<input type="button" 
									   disabled={!this.state.report} 
									   value="Update"
									   className={[
									   		"btn"
									   	].join( " " )}
									   onClick={this.updateReport} />
							</td>
						</tr>
					);
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

				"onClickCloseReportButton": function onClickCloseReportButton( event ){
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

					return ( 
						<div className="report-table-container">
							<div 								
								className={ [
									"report-table-component",
								].join( " " ) }>
								<div 
									className={ [
										"report-table-header"
									].join( " " ) }>
									<div
										className={ [
											"header-icon",
											"shown",
											"inline-block"
										].join( " " ) }>
										
									</div>

									<div
										className={ [
											"header-title",
											"shown",
											"inline-block"
										].join( " " ) }>
										<span>
											{ REPORT_HEADER_LABEL.toUpperCase( ) }
										</span>
									</div>

									<div 
										className={ [
											"close-report-table-button",
											"shown",
											"inline-block"
										].join( " " ) }
										onClick={ this.onClickCloseReportButton }>
										<a 
											className={ [
												"action-element"
											].join( " " ) }
											href={ [
												"#",
												"close-report"
											].join( "/" ) }
											style={
												{
													"display": "block"
												}
											}>
											
											
										</a>
									</div>
								</div>
								<table border="1">
								<tr>
									<th>Title</th>
									<th>Description</th>
									<th>Report Status</th>
								</tr>
									{ reportList.map( this.onEachReportItem ) } 								
								</table>
							</div>
						</div>
					);
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

					PageFlow( scope, element, "report-table" );

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