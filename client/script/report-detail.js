angular
	
	.module( "ReportDetail", [ 
		"Event", 
		"PageFlow", 
		"MapPreview", 
		"ReportSharing",
		"ImageGrid"
	] )
	
	.constant( "REPORT_CASE_TITLE_PHRASE", labelData.REPORT_CASE_TITLE_PHRASE )

	.constant( "DATE_AND_TIME_LABEL", labelData.DATE_AND_TIME_LABEL )

	.constant( "REPORT_TITLE_LABEL", labelData.REPORT_TITLE_LABEL )

	.constant( "REPORT_DETAIL_LABEL", labelData.REPORT_DETAIL_LABEL )

	.constant( "LESS_DETAIL_LABEL", labelData.LESS_DETAIL_LABEL )

	.constant( "SHOW_IMAGES_LABEL", labelData.SHOW_IMAGES_LABEL )

	.constant( "CLOSE_IMAGES_LABEL", labelData.CLOSE_IMAGES_LABEL )

	.factory( "ReportDetail", [
		"MapPreview",
		"attachReportSharing",
		"attachImageGrid",
		"REPORT_CASE_TITLE_PHRASE",
		"DATE_AND_TIME_LABEL",
		"REPORT_TITLE_LABEL",
		"REPORT_DETAIL_LABEL",
		"LESS_DETAIL_LABEL",
		"SHOW_IMAGES_LABEL",
		"CLOSE_IMAGES_LABEL",
		function factory( 
			MapPreview,
			attachReportSharing,
			attachImageGrid,
			REPORT_CASE_TITLE_PHRASE,
			DATE_AND_TIME_LABEL,
			REPORT_TITLE_LABEL,
			REPORT_DETAIL_LABEL,
			LESS_DETAIL_LABEL,
			SHOW_IMAGES_LABEL,
			CLOSE_IMAGES_LABEL
		){
			var ReportDetail = React.createClass( {
				"statics": {
					"attach": function attach( scope, container, optionSet ){
						var reportDetailComponent = (
							<ReportDetail 
								scope={ scope }
								container={ container }
								reportDetailID={ optionSet.reportDetailID }
								reportData={ optionSet.reportData } />
						);

						React.render( reportDetailComponent, container[ 0 ] );

						return this;
					}
				},

				"onClickCloseImages": function onClickCloseImages( ){
					$( ".crime-detail-teaser", this.getDOMNode( ) ).show( );

					$( ".close-images-button", this.getDOMNode( ) ).hide( );

					$( ".less-detail-button", this.getDOMNode( ) ).show( );

					$( ".image-grid", this.getDOMNode( ) ).css( "visibility", "hidden" );

					$( ".report-header-image-view", this.getDOMNode( ) ).css( "visibility", "hidden" );

					$( ".location-image-view", this.getDOMNode( ) ).css( "visibility", "hidden" );

					$( ".report-info-image-view", this.getDOMNode( ) ).css( "visibility", "hidden" );
				},

				"onClickShowImages": function onClickShowImages( ){
					$( ".crime-detail-teaser", this.getDOMNode( ) ).hide( );

					$( ".close-images-button", this.getDOMNode( ) ).show( );

					$( ".less-detail-button", this.getDOMNode( ) ).hide( );

					$( ".image-grid", this.getDOMNode( ) ).css( "visibility", "visible" );

					$( ".report-header-image-view", this.getDOMNode( ) ).css( "visibility", "visible" );

					$( ".location-image-view", this.getDOMNode( ) ).css( "visibility", "visible" );

					$( ".report-info-image-view", this.getDOMNode( ) ).css( "visibility", "visible" );
				},

				"onClickCloseReportDetail": function onClickCloseReportDetail( ){
					this.scope.publish( "close-report-detail", this.props.reportDetailID, true );
				},

				"onClickLessDetail": function onClickLessDetail( ){
					this.scope.publish( "open-report-preview", this.props.reportDetailID, true );
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

				"loadImageList": function loadImageList( ){
					var reportMediaList = this.state.reportData.reportMediaList;

					reportMediaList = reportMediaList || this.props.reportData.reportMediaList;

					if( !_.isEmpty( reportMediaList ) ){
						var imageList = _.filter( reportMediaList,
							function onEachMediaItem( mediaData ){
								return mediaData.type == "image";
							} );

						var self = this;
						this.scope.publish( "download-image-list", imageList,
							function onDownloadImageList( error, rawImageList ){
								if( error ){

								}else{
									var reportDetailID = self.props.reportDetailID;
									
									var imageList = _.map( rawImageList,
										function onEachRawImage( rawImage ){
											return {
												"imageFullSource": rawImage
											};
										} );

									attachImageGrid( {
										"scope": self.scope,
										"element": $( ".image-grid", self.getDOMNode( ) ),
										"namespace": reportDetailID,
										"imageList": imageList
									} );
								}
							} );
					
					}else{
						$( ".show-images-button", this.getDOMNode( ) ).hide( );	
					}
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "show-report-detail",
						function onShowReportDetail( reportDetailID ){
							if( self.props.reportDetailID == reportDetailID ){
								self.loadImageList( );				
							}
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
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
						uri.host( )
					].join( "/" );

					var categoryIconPinSource = [ 
						currentHostAddress, 
						"image", 
						[ reportData.reportCaseType, "small", "marker.png" ].join( "-" ) 
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
					
					return; //: @template: template/report-detail.html
				},

				"componentDidMount": function componentDidMount( ){
					var reportDetailID = this.props.reportDetailID;
					
					attachReportSharing( {
						"scope": this.scope,
						"element": $( ".report-sharing", this.getDOMNode( ) ),
						"namespace": reportDetailID
					} );

					var container = this.props.container;

					$( ".close-images-button", this.getDOMNode( ) ).hide( );

					$( ".image-grid", this.getDOMNode( ) ).css( "visibility", "hidden" );

					$( ".report-header-image-view", this.getDOMNode( ) ).css( "visibility", "hidden" );

					$( ".location-image-view", this.getDOMNode( ) ).css( "visibility", "hidden" );

					$( ".report-info-image-view", this.getDOMNode( ) ).css( "visibility", "hidden" );

					this.scope.publish( "report-detail-rendered", reportDetailID, container );
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

				if( optionSet.embedState != "no-embed" ){
					scope = scope.$new( true );
				}

				scope.namespace = optionSet.reportDetailID;

				Event( scope );

				var pageFlow = PageFlow( scope, element, "report-detail" );

				if( optionSet.embedState != "no-embed" ){
					pageFlow.namespaceList = _.without( pageFlow.namespaceList, "page" );
				}

				scope.on( "show-report-detail",
					function onShowReportDetail( reportDetailID ){
						if( optionSet.reportDetailID == reportDetailID ){
							scope.showPage( );	
						}
					} );

				scope.on( "hide-report-detail",
					function onHideReportDetail( reportDetailID ){
						if( optionSet.reportDetailID == reportDetailID ){
							scope.hidePage( );	
						}
					} );

				scope.publish( "hide-report-detail", optionSet.reportDetailID );

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
						"attributeSet": attributeSet,
						"embedState": "no-embed"
					} );
				}
			};
		}
	] );