angular.module( "ReportSpecifyCategory", [ 
	"Event", 
	"PageFlow", 
	"MapPreview", 
	"CaseCategoryList", 
	"MapView" 
] )
	
	.constant( "REPORT_HEADER_TITLE", labelData.REPORT_HEADER_TITLE )

	.constant( "SPECIFY_CATEGORY_PROGRESS_LABEL", labelData.SPECIFY_CATEGORY_PROGRESS_LABEL )

	.constant( "INCIDENT_DETAIL_PROGRESS_LABEL", labelData.INCIDENT_DETAIL_PROGRESS_LABEL )

	.constant( "REPORT_FINAL_PROGRESS_LABEL", labelData.REPORT_FINAL_PROGRESS_LABEL )

	.constant( "CONFIRM_BUTTON_LABEL", labelData.CONFIRM_BUTTON_LABEL )

	.constant( "CANCEL_BUTTON_LABEL", labelData.CANCEL_BUTTON_LABEL )

	.constant( "WARN_IF_NO_SELECTED_CATEGORY", labelData.WARN_IF_NO_SELECTED_CATEGORY )

	.factory( "ReportSpecifyCategory", [
		"MapPreview",
		"attachCaseCategoryList",
		"DEFAULT_POSITION",
		"DEFAULT_MAP_ZOOM",
		"REPORT_HEADER_TITLE",
		"SPECIFY_CATEGORY_PROGRESS_LABEL",
		"INCIDENT_DETAIL_PROGRESS_LABEL",
		"REPORT_FINAL_PROGRESS_LABEL",
		"CONFIRM_BUTTON_LABEL",
		"CANCEL_BUTTON_LABEL",
		"WARN_IF_NO_SELECTED_CATEGORY",
		function factory( 
			MapPreview,
			attachCaseCategoryList,
			DEFAULT_POSITION, 
			DEFAULT_MAP_ZOOM,
			REPORT_HEADER_TITLE,
			SPECIFY_CATEGORY_PROGRESS_LABEL,
			INCIDENT_DETAIL_PROGRESS_LABEL,
			REPORT_FINAL_PROGRESS_LABEL,
			CONFIRM_BUTTON_LABEL,
			CANCEL_BUTTON_LABEL,
			WARN_IF_NO_SELECTED_CATEGORY
		){
			var ReportSpecifyCategory = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						var reportSpecifyCategoryComponent = (
							<ReportSpecifyCategory 
								scope={ scope } />
						);

						React.render( reportSpecifyCategoryComponent, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"staticMapURL": "",
						"selectedCaseCategory": "",
						"latitude": DEFAULT_POSITION.lat( ),
						"longitude": DEFAULT_POSITION.lng( ),
						"zoom": DEFAULT_MAP_ZOOM
					};
				},

				"onClickConfirm": function onClickConfirm( ){
					if( _.isEmpty( this.state.selectedCaseCategory ) ){
						this.scope.publish( "notify", WARN_IF_NO_SELECTED_CATEGORY, "warn" );

					}else{
						this.scope.publish( "confirm-report-specify-category" );	
					}
				},

				"onClickCancel": function onClickCancel( ){
					this.scope.publish( "cancel-report-specify-category" );
				},

				"onSelectCaseCategory": function onSelectCaseCategory( selectedCaseCategory ){
					selectedCaseCategory = _.last( selectedCaseCategory );
					this.setState( {
						"selectedCaseCategory": selectedCaseCategory
					} );

					this.scope.publish( "set-selected-case-category", 
						selectedCaseCategory, "report-specify-category" );
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "set-report-specify-category-data",
						function onSetReportSpecifyCategoryData( reportData ){
							self.setState( {
								"latitude": reportData.latitude,
								"longitude": reportData.longitude,
								"zoom": reportData.zoom
							} );
						} );

					this.scope.on( "get-report-specify-category-data",
						function onGetReportSpecifyCategoryData( callback ){
							callback( null, {
								"staticMapURL": self.state.staticMapURL,
								"selectedCaseCategory": self.state.selectedCaseCategory,
								"latitude": self.state.latitude,
								"longitude": self.state.longitude,
								"zoom": self.state.zoom
							} );
						} );

					this.scope.on( "clear-report-specify-category-data",
						function onClearReportSpecifyCategoryData( ){
							self.setState( {
								"latitude": DEFAULT_POSITION.lat( ),
								"longitude": DEFAULT_POSITION.lng( ),
								"zoom": DEFAULT_MAP_ZOOM
							} );

							self.scope.publish( "clear-selected-case-category", "report-specify-category" );
						} );

					this.scope.on( "show-report-specify-category",
						function onShowReportSpecifyCategory( ){
							self.scope.publish( "show-case-category-list", "report-specify-category" );
						} );

					this.scope.on( "hide-report-specify-category",
						function onHideReportSpecifyCategory( ){
							self.scope.publish( "hide-case-category-list", "report-specify-category" );
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"componentWillUpdate": function componentWillUpdate( ){

				},

				"render": function onRender( ){
					var position = new google.maps.LatLng( this.state.latitude, this.state.longitude );

					var zoom = this.state.zoom;

					var uri = new URI( );
					var currentHostAddress = [ 
						"http:/",
						uri.host( )
					].join( "/" );

					var selectedCaseCategory = this.state.selectedCaseCategory;

					var categoryIconPinSource = [ 
						currentHostAddress, 
						"image", 
						( selectedCaseCategory )?
							[ selectedCaseCategory, "small", "marker.png" ].join( "-" ) :
							"small-map-pointer.png"
					].join( "/" );

					return; //: @template: template/report-specify-category.html
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					if( prevState.latitude != this.state.latitude &&
						prevState.longitude != this.state.longitude &&
						prevState.zoom != this.state.zoom )
					{
						var position = new google.maps.LatLng( this.state.latitude, this.state.longitude );

						var uri = new URI( );
						var currentHostAddress = [ 
							"http:/",
							uri.host( )
						].join( "/" );

						var selectedCaseCategory = this.state.selectedCaseCategory;

						var categoryIconPinSource = [ 
							currentHostAddress, 
							"image",
							( selectedCaseCategory )?
								[ selectedCaseCategory, "small", "marker.png" ].join( "-" ) :
								"small-map-pointer.png"
						].join( "/" );

						this.setState( {
							"staticMapURL": MapPreview
								.constructStaticMapURL( 
									position, 
									this.state.zoom, 
									categoryIconPinSource,
									staticData.REPORT_MAP_PREVIEW_WIDTH,
									staticData.REPORT_MAP_PREVIEW_HEIGHT )
						} );
					}

					if( !_.isEqual( prevState.selectedCaseCategory, this.state.selectedCaseCategory ) &&
						!_.isEmpty( this.state.selectedCaseCategory ) &&
						this.state.latitude &&
						this.state.longitude &&
						this.state.zoom )
					{
						var position = new google.maps.LatLng( this.state.latitude, this.state.longitude );

						var uri = new URI( );
						var currentHostAddress = [ 
							"http:/",
							uri.host( )
						].join( "/" );

						var selectedCaseCategory = this.state.selectedCaseCategory;

						var categoryIconPinSource = [ 
							currentHostAddress, 
							"image", 
							[ selectedCaseCategory, "small", "marker.png" ].join( "-" ) 
						].join( "/" );

						this.setState( {
							"staticMapURL": MapPreview
								.constructStaticMapURL( 
									position, 
									this.state.zoom, 
									categoryIconPinSource,
									staticData.REPORT_MAP_PREVIEW_WIDTH,
									staticData.REPORT_MAP_PREVIEW_HEIGHT )
						} );
					}
				},

				"componentDidMount": function componentDidMount( ){
					attachCaseCategoryList( {
						"scope": this.scope,
						"element": $( ".case-category-list", this.getDOMNode( ) ),
						"onSelectCaseCategory": this.onSelectCaseCategory,
						"namespace": "report-specify-category"
					} );

					this.scope.publish( "report-specify-category-rendered" );
				}
			} );

			return ReportSpecifyCategory;
		}
	] )

	.factory( "attachReportSpecifyCategory", [
		"$rootScope",
		"Event",
		"PageFlow",
		"ReportSpecifyCategory",
		function factory( $rootScope, Event, PageFlow, ReportSpecifyCategory ){
			var attachReportSpecifyCategory = function attachReportSpecifyCategory( optionSet ){
				var element = optionSet.element;

				if( _.isEmpty( element ) || element.length == 0 ){
					throw new Error( "unable to attach component" );
				}

				var scope = optionSet.scope || $rootScope;

				if( optionSet.embedState != "no-embed" ){
					scope = scope.$new( true );
				}

				scope.namespace = optionSet.namespace;

				Event( scope );

				var pageFlow = PageFlow( scope, element, "report-specify-category overflow" );

				if( optionSet.embedState != "no-embed" ){
					pageFlow.namespaceList = _.without( pageFlow.namespaceList, "page" );
				}

				scope.on( "show-report-specify-category",
					function onShowReportSpecifyCategory( ){
						scope.showPage( );
					} );

				scope.on( "hide-report-specify-category",
					function onHideReportSpecifyCategory( ){
						scope.hidePage( );
					} );

				scope.publish( "hide-report-specify-category" );

				ReportSpecifyCategory.attach( scope, element );
			};

			return attachReportSpecifyCategory;
		}
	] )

	.directive( "reportSpecifyCategory", [
		"attachReportSpecifyCategory",
		function directive( attachReportSpecifyCategory ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					attachReportSpecifyCategory( {
						"scope": scope,
						"element": element,
						"attributeSet": attributeSet,
						"embedState": "no-embed",
						"namespace": "report-specify-category"
					} );
				}
			}
		}
	] )