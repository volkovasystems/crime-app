angular
	.module( "Report", [ 
		"Event", 
		"PageFlow", 
		"Icon", 
		"MapPreview",
		"TitleInput", 
		"DescriptionInput"
	] )
	
	.value( "REPORT_HEADER_LABEL", "report a crime" )

	.factory( "Report", [
		"Icon",
		"MapPreview",
		"TitleInput",
		"DescriptionInput",
		"REPORT_HEADER_LABEL",
		function factory( 
			Icon, 
			MapPreview,
			TitleInput, 
			DescriptionInput, 
			REPORT_HEADER_LABEL
		){
			var Report = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						var reportComponent = <Report
							scope={ scope }/>

						React.render( reportComponent, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"title": "",
						"description": "",
						"timestamp": "",
						"category": "",
						"position": null,
						"zoom": null,
						"address": "",
						"staticMapURL": "#",
						"reportState": "report-empty",
						"componentState": "report-normal"
					};
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "set-report-data",
						function onSetReportData( reportData, callback ){
							self.setState( reportData,
								function onStateChanged( ){
									callback( );
								} );
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					var position = this.state.position;
					
					var address = this.state.address;
					
					var zoom = this.state.zoom;

					return ( 
						<div className="report-container">
							<div 
								className={ [
									"report-component",
								].join( " " ) }>

								<div 
									className={ [
										"report-header"
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
								</div>

								<div
									className={ [
										"report-form"
									].join( " " ) }>

									<MapPreview
										title="crime location"
										parent={ this }
										position={ position }
										zoom={ zoom } 
										address={ address } />

									<TitleInput 
										parent={ this }
										title="crime title"
										titleName="title" />

									<DescriptionInput 
										parent={ this }
										title="crime description"
										titleName="description" />
								</div>
								
							</div>
						</div>
					);
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.publish( "report-rendered" );
				}
			} );

			return Report;
		}
	] )
	
	.directive( "report", [
		"Event",
		"PageFlow",
		"Report",
		function directive( Event, PageFlow, Report ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "report" );

					scope.on( "show-report",
						function onShowReporting( ){
							scope.showPage( );
						} );

					scope.on( "hide-report",
						function onHideReporting( ){
							scope.hidePage( );
						} );

					scope.publish( "hide-report" );

					Report
						.attach( scope, element );
				}
			};
		}
	] );