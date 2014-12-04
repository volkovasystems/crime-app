angular.module( "ReportList", [ "Event", "PageFlow", "MapPreview" ] )

	.constant( "REPORT_LIST_HEADER_LABEL", labelData.REPORT_LIST_HEADER_LABEL )

	.constant( "REPORT_ITEM_PHRASE", labelData.REPORT_ITEM_PHRASE )

	.factory( "ReportList", [
		"MapPreview",
		"REPORT_LIST_HEADER_LABEL",
		"REPORT_ITEM_PHRASE",
		function factory( 
			MapPreview, 
			REPORT_LIST_HEADER_LABEL, 
			REPORT_ITEM_PHRASE
		){
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
						"componentState": "report-list-minified"
					};
				},

				"onClickExpandReportList": function onClickExpandReportList( ){
					this.scope.publish( "show-expanded-report-list" );

					this.setState( {
						"componentState": "report-list-expanded"
					} );
				},

				"onClickCloseReportList": function onClickCloseReportList( event ){
					this.scope.publish( "show-minified-report-list" );
				},

				"onClickReportItem": function onClickReportItem( event ){
					var reportID = $( event.currentTarget ).attr( "value" );

					
				},

				"onEachReportItem": function onEachReportList( reportItem, index ){
					var hashedValue = reportItem.hashedValue || btoa( JSON.stringify( reportItem ) );

					var key = [ hashedValue, index ].join( ":" )

					var reportID = reportItem.reportID;

					var reportTimestamp = reportItem.reportTimestamp;

					var timeFromNow = moment( reportTimestamp ).fromNow( ).toUpperCase( );

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

					var reportCaseTitle = reportItem.reportCaseTitle;

					var reportAddress = reportItem.reportAddress;

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

					this.scope.on( "show-minified-report-list",
						function onShowMinifiedReportList( ){
							self.setState( {
								"componentState": "report-list-minified"
							} );

							self.scope.publish( "show-report-list" );
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