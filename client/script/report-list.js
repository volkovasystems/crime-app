angular.module( "ReportList", [ "Event", "PageFlow", "Icon", "MapPreview" ] )

	.value( "REPORT_LIST_HEADER_LABEL", "crime report list" )

	.factory( "ReportList", [
		"Icon",
		"MapPreview",
		"REPORT_LIST_HEADER_LABEL",
		function factory( Icon, MapPreview, REPORT_LIST_HEADER_LABEL ){
			var ReportList = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						React.render( <ReportList scope={ scope } />, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"reportList": [ ],
						"expandedReportItemList": [ ],
						"componentState": "report-list-normal"
					};
				},

				"onClickCloseReportListButton": function onClickCloseReportListButton( event ){
					this.scope.publish( "hide-report-list" );
				},

				"onClickReportItem": function onClickReportItem( event ){
					var reportID = $( event.currentTarget ).attr( "value" );

					var expandedReportItemList = this.state.expandedReportItemList.slice( 0 );

					if( _.contains( expandedReportItemList, reportID ) ){

						this.setState( {
							"expandedReportItemList": _.without( expandedReportItemList, reportID )
						} );
						
					}else{
						this.setState( {
							"expandedReportItemList": expandedReportItemList.concat( [ reportID ] )
						} );
					}
				},

				"onEachReportItem": function onEachReportList( reportItem, index ){
					var hashedValue = reportItem.hashedValue || btoa( JSON.stringify( reportItem ) );

					var key = [ hashedValue, index ].join( ":" )
					
					var expandedReportItemList = this.state.expandedReportItemList;

					var reportID = reportItem.reportID;

					var reportTitle = reportItem.reportTitle.toUpperCase( );

					var reportTimestamp = reportItem.reportTimestamp;

					var isExpanded = _.contains( expandedReportItemList, reportID );

					var timeFromNow = moment( reportTimestamp ).fromNow( ).toUpperCase( );

					var descriptiveDate = moment( reportTimestamp ).format( "dddd, MMMM Do YYYY" ).toUpperCase( );

					var descriptiveTime = moment( reportTimestamp ).format( "h:mm:ss a" ).toUpperCase( );

					var latitude = reportItem.reportLocation.latitude;
					var longitude = reportItem.reportLocation.longitude;
					var mapPosition = new google.maps.LatLng( latitude, longitude );

					var mapZoom = reportItem.reportLocation.zoom;

					var reportAddress = reportItem.reportAddress;

					var reportDescription = reportItem.reportDescription;

					return (
						<li
							key={ key }
							className={ [
								"report-item",
								( isExpanded )? "expanded" : "collapsed",
								"shown",
								"inline-block"
							].join( " " ) }
							onClick={ this.onClickReportItem }
							value={ reportID }>

							<div
								className={ [
									"report-item-icon",
									( isExpanded )? "expanded" : "collapsed"
								].join( " " ) }>
								<Icon 
									name="ic_expand_less_24px"
									style={
										{
											"display": ( isExpanded )? "block" : "none"
										}
									} />
								<Icon 
									name="ic_expand_more_24px"
									style={
										{
											"display": ( isExpanded )? "none" : "block"
										}
									} />
							</div>

							<div
								className={ [
									"report-item-header",
									( isExpanded )? "expanded" : "collapsed"
								].join( " " ) }>

								<div
									className={ [
										"report-time-from-now"
									].join( " " ) }>
									{ timeFromNow.toUpperCase( ) }
								</div>

								<div
									className={ [
										"report-title"
									].join( " " ) }>
									{ reportTitle.toUpperCase( ) }
								</div>

								<div
									className={ [
										"report-date"
									].join( " " ) }>
									{ descriptiveDate.toUpperCase( ) }
								</div>

								<div
									className={ [
										"report-time"
									].join( " " ) }>
									{ descriptiveTime.toUpperCase( ) }
								</div>
							</div>

							<div
								className={ [
									"report-item-body",
									( isExpanded )? "expanded" : "collapsed"
								].join( " " ) }>

								<MapPreview
									parent={ this }
									position={ mapPosition }
									zoom={ mapZoom } 
									address={ reportAddress } />
							</div>

							<div
								className={ [
									"report-item-footer",
									( isExpanded )? "expanded" : "collapsed"
								].join( " " ) }>
								<p>
									{ reportDescription.toUpperCase( ) }
								</p>
							</div>
						</li>
					);
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "set-report-list",
						function onSetReportList( reportList ){
							self.setState( {
								"reportList": reportList
							} );
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					var componentState = this.state.componentState;

					var reportList = this.state.reportList;

					return ( 
						<div 
							className={ [
								"report-list-container",
								componentState
							].join( " " ) }>

							<div
								className={ [
									"report-list-component",
									componentState
								].join( " " ) }>

								<div 
									className={ [
										"report-list-header"
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
											{ REPORT_LIST_HEADER_LABEL.toUpperCase( ) }
										</span>
									</div>

									<div 
										className={ [
											"close-report-list-button",
											"shown",
											"inline-block"
										].join( " " ) }
										onClick={ this.onClickCloseReportListButton }>
										<a 
											className={ [
												"action-element"
											].join( " " ) }
											href={ [
												"#",
												"close-report-list"
											].join( "/" ) }
											style={
												{
													"display": "block"
												}
											}>
											
											<Icon
												className={ [
													"close-report-list-icon"
												].join( " " ) }
												name="ic_close_24px" />
										</a>
									</div>
								</div>

								<div
									className={ [
										"report-list-body"
									].join( " " ) }>

									<ul 
										className={ [
											"list-container" 
										].join( " " ) }>
										{ reportList.map( this.onEachReportItem ) }
									</ul>
								</div>
							</div>
						</div>
					);
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.broadcast( "report-list-rendered" );	
				}
			} );

			return ReportList;
		}
	] )

	.directive( "reportList", [
		"Event",
		"PageFlow",
		"ReportList",
		function directive( Event, PageFlow, ReportList ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "report-list" );

					scope.on( "show-report-list",
						function onShowReportList( ){
							scope.showPage( );
						} );

					scope.on( "hide-report-list",
						function onHideReportList( ){
							scope.hidePage( );
						} );

					scope.publish( "hide-report-list" );

					ReportList
						.attach( scope, element );
				}
			};
		}
	] );