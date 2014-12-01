angular.module( "ReportPreview", [ "Event", "PageFlow" ] )
	
	.constant( "REPORT_CASE_TITLE_PHRASE", labelData.REPORT_CASE_TITLE_PHRASE )

	.constant( "DATE_AND_TIME_LABEL", labelData.DATE_AND_TIME_LABEL )

	.constant( "REPORT_TITLE_LABEL", labelData.REPORT_TITLE_LABEL )

	.constant( "MORE_DETAIL_LABEL", labelData.MORE_DETAIL_LABEL )

	.factory( "ReportPreview", [
		"REPORT_CASE_TITLE_PHRASE",
		"DATE_AND_TIME_LABEL",
		"REPORT_TITLE_LABEL",
		"MORE_DETAIL_LABEL",
		function factory(
			REPORT_CASE_TITLE_PHRASE,
			DATE_AND_TIME_LABEL,
			REPORT_TITLE_LABEL,
			MORE_DETAIL_LABEL
		){
			var ReportPreview = React.createClass( {
				"statics": {
					"attach": function attach( scope, container, optionSet ){
						var reportDetailComponent = (
							<ReportPreview 
								scope={ scope }
								container={ container }
								reportPreviewID={ optionSet.reportPreviewID }
								reportData={ optionSet.reportData } />
						);

						React.render( reportDetailComponent, container[ 0 ] );

						return this;
					}
				},

				"onClickCloseReportPreview": function onClickCloseReportPreview( ){
					this.scope.publish( "close-report-preview", this.props.reportPreviewID );
				},

				"onClickMoreDetail": function onClickMoreDetail( ){
					this.scope.publish( "open-report-detail", this.props.reportPreviewID );
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"reportPreviewID": "",
						"reportData": { }
					};
				},

				"getInitialState": function getInitialState( ){
					return {
						"reportData": { }
					};
				},
				
				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;
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

					var descriptiveDateAndTime = moment( reportTimestamp ).format( "MMM. D, YYYY h:mm A" );

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
					
					return; //: @template: template/report-preview.html
				},

				"componentDidMount": function componentDidMount( ){
					var reportPreviewID = this.props.reportPreviewID;
					
					var container = this.props.container

					this.scope.publish( "report-preview-rendered", reportPreviewID, container );
				}
			} );

			return ReportPreview;
		}
	] )

	.factory( "attachReportPreview", [
		"Event",
		"PageFlow",
		"ReportPreview",
		function factory( Event, PageFlow, ReportPreview ){
			var attachReportPreview = function attachReportPreview( optionSet ){
				var element = optionSet.element;

				if( _.isEmpty( element ) || element.length == 0 ){
					throw new Error( "unable to attach component" );
				}

				var scope = optionSet.scope || $rootScope;

				scope = scope.$new( true );

				Event( scope );

				var pageFlow = PageFlow( scope, element, "report-preview" );

				if( optionSet.embedState != "no-embed" ){
					pageFlow.namespaceList = _.without( pageFlow.namespaceList, "page" );
				}

				scope.on( "show-report-preview",
					function onShowReportPreview( reportPreviewID ){
						if( optionSet.reportPreviewID == reportPreviewID ){
							scope.showPage( );	
						}
					} );

				scope.on( "hide-report-preview",
					function onHideReportPreview( reportPreviewID ){
						if( optionSet.reportPreviewID == reportPreviewID ){
							scope.hidePage( );	
						}
					} );

				scope.publish( "hide-report-preview", optionSet.reportPreviewID );

				ReportPreview.attach( scope, element, {
					"reportPreviewID": optionSet.reportPreviewID,
					"reportData": optionSet.reportData
				} );
			};

			return attachReportPreview;
		}
	] )

	.directive( "reportPreview", [
		"attachReportPreview",
		function directive( attachReportPreview ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					attachReportPreview( {
						"scope": scope,
						"element": element,
						"attributeSet": attributeSet
					} );
				}
			};
		}
	] );