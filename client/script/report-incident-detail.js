angular
	
	.module( "ReportIncidentDetail", [ "Event", "PageFlow" ] )
	
	.constant( "REPORT_HEADER_TITLE", labelData.REPORT_HEADER_TITLE )

	.constant( "SPECIFY_CATEGORY_PROGRESS_LABEL", labelData.SPECIFY_CATEGORY_PROGRESS_LABEL )

	.constant( "INCIDENT_DETAIL_PROGRESS_LABEL", labelData.INCIDENT_DETAIL_PROGRESS_LABEL )

	.constant( "REPORT_FINAL_PROGRESS_LABEL", labelData.REPORT_FINAL_PROGRESS_LABEL )

	.constant( "SEND_BUTTON_LABEL", labelData.SEND_BUTTON_LABEL )

	.constant( "CANCEL_BUTTON_LABEL", labelData.CANCEL_BUTTON_LABEL )

	.constant( "TITLE_LABEL", labelData.TITLE_LABEL )

	.constant( "DESCRIPTION_PHRASE", labelData.DESCRIPTION_PHRASE )

	.constant( "TIME_HAPPENED_PHRASE", labelData.TIME_HAPPENED_PHRASE )

	.constant( "DATE_HAPPENED_PHRASE", labelData.DATE_HAPPENED_PHRASE )

	.constant( "SEND_REPORT_ANONYMOUSLY_PHRASE", labelData.SEND_REPORT_ANONYMOUSLY_PHRASE )

	.constant( "AGREEMENT_PHRASE", labelData.AGREEMENT_PHRASE )

	.constant( "PRIVACY_POLICY_LABEL", labelData.PRIVACY_POLICY_LABEL )

	.constant( "WARN_IF_NOT_AGREED_PROMPT", labelData.WARN_IF_NOT_AGREED_PROMPT )

	.constant( "WARN_IF_MINIMUM_INPUT_REPORT_TITLE_PROMPT", labelData.WARN_IF_MINIMUM_INPUT_REPORT_TITLE_PROMPT )

	.constant( "WARN_IF_MINIMUM_INPUT_REPORT_DESCRIPTION_PROMPT", labelData.WARN_IF_MINIMUM_INPUT_REPORT_DESCRIPTION_PROMPT )

	.constant( "TIME_FORMAT_PLACEHOLDER", labelData.TIME_FORMAT_PLACEHOLDER )

	.constant( "DATE_FORMAT_PLACEHOLDER", labelData.DATE_FORMAT_PLACEHOLDER )

	.factory( "ReportIncidentDetail", [
		"REPORT_HEADER_TITLE",
		"SPECIFY_CATEGORY_PROGRESS_LABEL",
		"INCIDENT_DETAIL_PROGRESS_LABEL",
		"REPORT_FINAL_PROGRESS_LABEL",
		"SEND_BUTTON_LABEL",
		"CANCEL_BUTTON_LABEL",
		"TITLE_LABEL",
		"DESCRIPTION_PHRASE",
		"TIME_HAPPENED_PHRASE",
		"DATE_HAPPENED_PHRASE",
		"SEND_REPORT_ANONYMOUSLY_PHRASE",
		"AGREEMENT_PHRASE",
		"PRIVACY_POLICY_LABEL",
		"WARN_IF_NOT_AGREED_PROMPT",
		"TIME_FORMAT_PLACEHOLDER",
		"DATE_FORMAT_PLACEHOLDER",
		"WARN_IF_MINIMUM_INPUT_REPORT_TITLE_PROMPT",
		"WARN_IF_MINIMUM_INPUT_REPORT_DESCRIPTION_PROMPT",
		function factory( 
			REPORT_HEADER_TITLE,
			SPECIFY_CATEGORY_PROGRESS_LABEL,
			INCIDENT_DETAIL_PROGRESS_LABEL,
			REPORT_FINAL_PROGRESS_LABEL,
			SEND_BUTTON_LABEL,
			CANCEL_BUTTON_LABEL,
			TITLE_LABEL,
			DESCRIPTION_PHRASE,
			TIME_HAPPENED_PHRASE,
			DATE_HAPPENED_PHRASE,
			SEND_REPORT_ANONYMOUSLY_PHRASE,
			AGREEMENT_PHRASE,
			PRIVACY_POLICY_LABEL,
			WARN_IF_NOT_AGREED_PROMPT,
			TIME_FORMAT_PLACEHOLDER,
			DATE_FORMAT_PLACEHOLDER,
			WARN_IF_MINIMUM_INPUT_REPORT_TITLE_PROMPT,
			WARN_IF_MINIMUM_INPUT_REPORT_DESCRIPTION_PROMPT
		){
			var ReportIncidentDetail = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						var reportIncidentCategoryComponent = (
							<ReportIncidentDetail 
								scope={ scope } />
						)

						React.render( reportIncidentCategoryComponent, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"title": "",
						"description": "",
						"time": moment( ).format( "hh:mm A" ),
						"date": moment( ).format( "MM/DD/YYYY" ),
						"hasAgreed": false,
						"isAnonymous": false,
						"isTimeValid": true,
						"isDateValid": true
					};
				},

				"componentWillUpdate": function componentWillUpdate( ){

				},

				"onChangeTitle": function onChangeTitle( event ){
					var title = event.target.value;

					this.setState( {
						"title": title
					} );
				},

				"onChangeDescription": function onChangeDescription( event ){
					var description = event.target.value;

					this.setState( {
						"description": description
					} );
				},

				"onChangeTime": function onChangeTime( event ){
					var time = event.target.value;

					var isTimeValid = moment( time.toUpperCase( ), "hh:mm A" ).isValid( );

					this.setState( {
						"time": time,
						"isTimeValid": isTimeValid
					} );
				},

				"onChangeDate": function onChangeDate( event ){
					var date = event.target.value;

					var isDateValid = moment( date.toUpperCase( ), "MM/DD/YYYY" ).isValid( );

					this.setState( {
						"date": date,
						"isDateValid": isDateValid
					} );
				},

				"onChangeIsAnonymous": function onChangeIsAnonymous( event ){
					var isAnonymous = event.target.checked;

					this.setState( {
						"isAnonymous": isAnonymous
					} );
				},

				"onChangeHasAgreed": function onChangeHasAgreed( event ){
					var hasAgreed = event.target.checked;

					this.setState( {
						"hasAgreed": hasAgreed
					} );
				},

				"onClickCloseReportIncidentDetail": function onClickCloseReportIncidentDetail( ){
					this.scope.publish( "close-report-incident-detail" );
				},

				"onClickSend": function onClickSend( ){
					var title = this.state.title;
					
					var description = this.state.description;

					if( title.split( " " ).length < staticData.REPORT_TITLE_MINIMUM_INPUT ){
						this.scope.publish( "notify", WARN_IF_MINIMUM_INPUT_REPORT_TITLE_PROMPT, "warn" );

					}else if( description.split( " " ).length < staticData.REPORT_DESCRIPTION_MINIMUM_INPUT ){
						this.scope.publish( "notify", WARN_IF_MINIMUM_INPUT_REPORT_DESCRIPTION_PROMPT, "warn" );

					}else if( this.state.hasAgreed ){
						this.scope.publish( "send-report-incident-detail" );

					}else{
						this.scope.publish( "notify", WARN_IF_NOT_AGREED_PROMPT, "warn" );
					}
				},

				"onClickCancel": function onClickCancel( ){
					this.scope.publish( "cancel-report-incident-detail" );
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "get-report-incident-detail-data",
						function onGetReportIncidentDetailData( callback ){
							var timestampString = [ self.state.time, self.state.date ].join( " " );

							var timestamp = moment( timestampString, "hh:mm A MM/DD/YYYY" ).valueOf( );	

							var reportData = {
								"title": self.state.title.trim( ),
								"description": self.state.description.trim( ),
								"timestamp": timestamp,
								"anonymous": self.state.isAnonymous
							};

							callback( null, reportData );
						} );

					this.scope.on( "show-report-incident-detail",
						function onShowReportIncidentDetail( ){
							self.setState( {
								"time": moment( ).format( "hh:mm A" ),
								"date": moment( ).format( "MM/DD/YYYY" )
							} );
						} );

					this.scope.on( "clear-report-incident-detail-data",
						function onClearReportIncidentDetailData( ){
							self.setState( {
								"title": "",
								"description": "",
								"time": moment( ).format( "hh:mm A" ),
								"date": moment( ).format( "MM/DD/YYYY" ),
								"isAnonymous": false,
								"hasAgreed": false
							} );
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					var title = this.state.title;

					var description = this.state.description;

					var time = this.state.time;

					var date = this.state.date;

					var hasAgreed = this.state.hasAgreed;

					var isAnonymous = this.state.isAnonymous;

					var isTimeValid = this.state.isTimeValid;

					var isDateValid = this.state.isDateValid;
					
					return; //: @template: template/report-incident-detail.html
				},

				"componentDidUpdate": function componentDidUpdate( ){

				},

				"componentDidMount": function componentDidMount( ){
					this.scope.publish( "report-incident-detail-rendered" );
				}
			} );

			return ReportIncidentDetail;
		}
	] )

	.factory( "attachReportIncidentDetail", [
		"$rootScope",
		"Event",
		"PageFlow",
		"ReportIncidentDetail",
		function factory( $rootScope, Event, PageFlow, ReportIncidentDetail ){
			var attachReportIncidentDetail = function attachReportIncidentDetail( optionSet ){
				var element = optionSet.element;

				if( _.isEmpty( element ) || element.length == 0 ){
					throw new Error( "unable to attach component" );
				}

				var scope = optionSet.scope || $rootScope;

				scope = scope.$new( true );

				Event( scope );

				var pageFlow = PageFlow( scope, element, "report-incident-detail overflow" );

				if( optionSet.embedState != "no-embed" ){
					pageFlow.namespaceList = _.without( pageFlow.namespaceList, "page" );
				}

				scope.on( "show-report-incident-detail",
					function onShowReportIncidentDetail( ){
						scope.showPage( );
					} );

				scope.on( "hide-report-incident-detail",
					function onHideReportIncidentDetail( ){
						scope.hidePage( );
					} );

				scope.publish( "hide-report-incident-detail" );

				ReportIncidentDetail.attach( scope, element );
			};

			return attachReportIncidentDetail;
		}
	] )

	.directive( "reportIncidentDetail", [
		"attachReportIncidentDetail",
		function directive( attachReportIncidentDetail ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					attachReportIncidentDetail( {
						"scope": scope,
						"element": element,
						"attributeSet": attributeSet,
						"embedState": "no-embed" 
					} );
				}
			}
		}
	] )