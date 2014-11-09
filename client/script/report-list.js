angular.module( "ReportList", [ "Event", "PageFlow", "Icon" ] )
	.factory( "ReportList", [
		"Icon",
		function factory( Icon ){
			var ReportList = React.createClass( {
				"getInitialState": function getInitialState( ){
					return {
						"reportList": [ ],
						"expandedItemList": [ ],
						"componentState": "report-list-normal"
					};
				},

				"onEachReportItem": function onEachReportList( reportItem, index ){
					var hashedValue = reportItem.hashedValue || btoa( JSON.stringify( reportItem ) );

					var key = [ hashedValue, index ].join( ":" )
					
					var expandedItemList = this.state.expandedItemList;

					var reportID = reportItem.reportID;

					var reportTitle = reportItem.reportTitle.toUpperCase( );

					var reportTimestamp = reportItem.reportTimestamp;

					var isExpanded = _.contains( expandedItemList, reportID );

					var timeFromNow = moment( reportTimestamp ).fromNow( ).toUpperCase( );

					var descriptiveDate = moment( reportTimestamp ).format( "dddd, MMMM Do YYYY" ).toUpperCase( );

					var descriptiveTime = moment( reportTimestamp ).format( "h:mm:ss a" ).toUpperCase( );

					return (
						<li
							key={ key }
							className={ [
								"report-item",
								( isExpanded )? "expanded" : "collapsed"
							].join( " " ) }>

							<div
								className={ [
									"report-item-icon",
									( isExpanded )? "expanded" : "collapsed"
								].join( " " ) }>
								<Icon name={ ( isExpanded )? "ic_expand_less_24px" : "ic_expoand_more_24px" }>
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
									{ reporTitle.toUpperCase( ) }
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
								<div>
							</div>
						</li>
					);
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;
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
								<ul 
									className={ [
										"list-container" 
									].join( " " ) }>
									{ reportList.map( this.onEachReportItem ) }
								</ul>
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