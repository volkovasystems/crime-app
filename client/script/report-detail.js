angular.module( "ReportDetail", [ "Event", "PageFlow", "MapPreview" ] )
	
	.constant( "REPORT_CASE_TITLE_PHRASE", labelData.REPORT_CASE_TITLE_PHRASE )

	.constant( "DATE_AND_TIME_LABEL", labelData.DATE_AND_TIME_LABEL )

	.constant( "REPORT_TITLE_LABEL", labelData.REPORT_TITLE_LABEL )

	.constant( "REPORT_DETAIL_LABEL", labelData.REPORT_DETAIL_LABEL )

	.constant( "LESS_DETAIL_LABEL", labelData.LESS_DETAIL_LABEL )

	.factory( "ReportDetail", [
		"MapPreview",
		"REPORT_CASE_TITLE_PHRASE",
		"DATE_AND_TIME_LABEL",
		"REPORT_TITLE_LABEL",
		"REPORT_DETAIL_LABEL",
		"LESS_DETAIL_LABEL",
		function factory( 
			MapPreview,
			REPORT_CASE_TITLE_PHRASE,
			DATE_AND_TIME_LABEL,
			REPORT_TITLE_LABEL,
			REPORT_DETAIL_LABEL,
			LESS_DETAIL_LABEL
		){
			var ReportDetail = React.createClass( {
				"statics": {
					"attach": function attach( scope, container, optionSet ){
						var reportDetailComponent = (
							<ReportDetail 
								scope={ scope }
								reportDetailID={ optionSet.reportDetailID }
								reportData={ optionSet.reportData } />
						);

						React.render( reportDetailComponent, container[ 0 ] );

						return this;
					}
				},

				"onClickLessDetail": function onClickLessDetail( ){

				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"reportDetailID": "",
						"reportData": { }
					};
				},

				"getInitialState": function getInitialState( ){
					return {
						"reportData": { }
					};
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "set-report-detail",
						function onSetReportDetail( reportData ){
							var cleanReportID = reportData.reportID.replace( /[^A-Za-z0-9]/g, "" );

							if( cleanReportID == self.props.reportDetailID ){
								self.setState( {
									"reportData": reportData
								} );
							}
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"componentWillUpdate": function componentWillUpdate( ){

				},

				"shouldComponentUpdate": function shouldComponentUpdate( nextProps, nextState ){
					return !_.isEmpty( nextState.reportData );
				},

				"render": function onRender( ){
					var reportData = this.state.reportData;

					if( _.isEmpty( reportData ) ){
						reportData = this.props.reportData;
					}

					if( _.isEmpty( reportData ) ){
						return <div></div>;
					}

					var reportCaseTitle = reportData.reportCaseTitle;
					var reportTitle = reportData.reportTitle;
					var reportDescription = reportData.reportDescription;

					var position = new google.maps.LatLng( reportData.reportLocation.latitude, reportData.reportLocation.longitude );
					var zoom = reportData.reportLocation.zoom;

					var uri = new URI( );
					var currentHostAddress = [ 
						"http:/",
						( production )?
							uri.domain( ) :
							[ uri.domain( ), uri.port( ) ].join( ":" ) 
					].join( "/" );

					var categoryIconPinSource = [ 
						currentHostAddress, 
						"image", 
						[ reportData.reportCaseType, "marker.png" ].join( "-" ) 
					].join( "/" );

					var categoryIconSource = [ 
						currentHostAddress, 
						"image", 
						[ reportData.reportCaseType, "icon.png" ].join( "-" ) 
					].join( "/" );

					var reportTimestamp = reportData.reportTimestamp;

					var descriptiveDateAndTime = moment( reportTimestamp ).format( "MMM. d YYYY h:mm A" );

					var timeFromNow = moment( reportTimestamp ).fromNow( );

					var timeFromNowData = { };
					_.each( timeFromNow.split( " " ),
						function onEachTimeFromNow( timeFromNowToken, index ){
							if( index == 0 &&
								( /^\D+$/ ).test( timeFromNowToken ) )
							{
								timeFromNowData.prefix = timeFromNowToken;
							}else if( ( /^\d+$/ ).test( timeFromNowToken ) ){
								timeFromNowData.digit = timeFromNowToken;
							}

							if( index == 1 ){
								timeFromNowData.unit = timeFromNowToken;
							}

							if( index == 2 ){
								timeFromNowData.suffix = timeFromNowToken;
							}
						} );
					
					return; //: @template: template/report-detail.html
				},

				"componentDidUpdate": function componentDidUpdate( ){

				},

				"componentDidMount": function componentDidMount( ){
					this.scope.publish( "report-detail-rendered", this.props.reportDetailID );
				}
			} );

			return ReportDetail;
		}
	] )

	.factory( "attachReportDetail", [
		"Event",
		"PageFlow",
		"ReportDetail",
		function factory( Event, PageFlow, ReportDetail ){
			var attachReportDetail = function attachReportDetail( optionSet ){
				var element = optionSet.element;

				if( _.isEmpty( element ) || element.length == 0 ){
					throw new Error( "unable to attach component" );
				}

				var scope = optionSet.scope || $rootScope;

				scope = scope.$new( true );

				Event( scope );

				var pageFlow = PageFlow( scope, element, "report-detail" );

				if( optionSet.embedState != "no-embed" ){
					pageFlow.namespaceList = _.without( pageFlow.namespaceList, "page" );
				}

				scope.on( "show-report-detail",
					function onShowReportDetail( ){
						scope.showPage( );
					} );

				scope.on( "hide-report-detail",
					function onHideReportDetail( ){
						scope.hidePage( );
					} );

				scope.publish( "show-report-detail" );

				ReportDetail.attach( scope, element, {
					"reportDetailID": optionSet.reportDetailID,
					"reportData": optionSet.reportData
				} );
			};

			return attachReportDetail;
		}
	] )

	.directive( "reportDetail", [
		"attachReportDetail",
		function directive( attachReportDetail ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					attachReportDetail( {
						"scope": scope,
						"element": element,
						"attributeSet": attributeSet
					} );
				}
			};
		}
	] );