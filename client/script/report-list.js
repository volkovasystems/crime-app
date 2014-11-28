angular.module( "ReportList", [ "Event", "PageFlow", "Icon", "MapPreview" ] )

	.value( "REPORT_LIST_HEADER_LABEL", labelData.REPORT_LIST_HEADER_LABEL )

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

					return; //: @template: template/report-item.html
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

					var reportList = this.state.reportList || [ ];

					return; //: @template: template/report-list.html
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