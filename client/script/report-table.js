angular
	.module( "ReportTable", [ 
		"Event", 
		"PageFlow",
		"Icon"
	] )

	.value( "REPORT_HEADER_LABEL", "report a crime" )
	
	.factory( "ReportTable", [
		"REPORT_HEADER_LABEL",
		"Icon",
		function factory( REPORT_HEADER_LABEL , Icon ){
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

					this.scope.on( "set-report-list",
						function onSetReportData( reportList ){
							self.setState( {
								"reportList": reportList
							} );
						} );

					this.scope.on( "report-data",
						function onSetReportData ( reports ) {							
							console.log(reports);							

							self.setState( {
								"reportList": reports
							} );
						} );					
				},

				"onClickCloseReportButton": function onClickCloseReportButton( event ){
					this.scope.publish( "hide-report-table" );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"onEachReportItem": function onEachReportItem( reportData ){
					return (
						<tr>
							<td>
								{ reportData.reportTitle }
							</td>
							<td>
								{ reportData.reportDescription }
							</td>
							<td>
								<input type="button" 
									   disabled={ reportData.state == "accept" } 
									   name="reportStatusAccept" 
									   value="Accept" 
									   className={ [
									   		"btn",
											( reportData.state == "accept" ) ? "disabled" : 'enabled'
										].join( " " ) }/>
								<input type="button" 
									   disabled={ reportData.state == "reject" } 
									   name="reportStatusReject" 
									   value="Reject" 
									   className={ [
									   		"btn",
											( reportData.state == "reject" ) ? "disabled" : 'enabled'
										].join( " " ) } />
							</td>
						</tr>
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
										<Icon name="ic_report_problem_24px" />
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
											
											<Icon
												className={ [
													"close-report-table-icon"
												].join( " " ) }
												name="ic_close_24px" />
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