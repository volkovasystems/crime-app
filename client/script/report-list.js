Crime.directive( "reportList", [
	"PageFlow",
	function directive( PageFlow ){
		var crimeAccount = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"reportList": [ ],
					"componentState": "report-list-standby",
					"expandedReportItem": ""
				};
			},

			"onReportItemExpandButtonClick": function onReportItemExpandButtonClick( event ){

			},

			"componentWillMount": function componentWillMount( ){
			},

			"onEachReportItem": function onEachReportList( reportItem, index ){
				var hashedValue = reportItem.hashedValue || btoa( JSON.stringify( reportItem ) );

				var key = [ hashedValue, index ].join( ":" )
				
				var id = hashedValue;

				var expandedReportItem = this.state.expandedReportItem;
				var isExpanded = ( expandedReportItem === id );

				return (
					<li
						className={ [
							"report-item"
						].join( " " ) }>
						<div
							className={ [
								"report-item-container"
							].join( " " ) }>
							<div
								className={ [
									"report-item-map-preview",
									( isExpanded )? "expanded": "collapsed"
								].join( " " ) }>

							</div>
							<div
								className={ [
									"report-item-header"
								].join( " " ) }>
								<div
									className={ [
										"report-item-category-image"
									].join( " " ) }>
									<div
										className={ [
											"report-item-expand-button"
										].join( " " ) }
										onClick={ this.onReportItemExpandButtonClick }>
										<icon
											className={ [
												"report-item-expand-icon"
											].join( " " ) }
											name={
												( isExpanded )? "ic_expand_less_24px" : "ic_expand_more_24px"
											}
											src="../library/svg-sprite-navigation.svg" />
									</div>
								</div>
								<h2
									className={ [
										"report-item-title"
									].join( " " ) }>
								</h2>
								<span
									className={ [
										"report-item-time"
									].join( " " ) }>
								</span>
							</div>
							<div
								className={ [
									"report-item-footer"
								].join( " " ) }>
								<p
									className={ [
										"report-item-address"
									].join( " " ) }>
								</p>
								<p
									className={ [
										"report-item-description"
									].join( " " ) }>
								</p>
							</div>
						</div>
					</li>
				);
			},

			"render": function onRender( ){
				var componentState = this.state.componentState;

				var reportList = this.state.reportList;

				return ( 
					<div 
						className={ [
							"crime-report-list-container",
							componentState
						].join( " " ) }>

						<ul 
							className={ [
								"report-list" 
							].join( " " ) }>
							{ reportList.map( this.onEachReportItem ) }
						</ul>
					</div>
				);
			},

			"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
			},

			"componentDidMount": function componentDidMount( ){
				this.props.scope.$root.$broadcast( "crime-report-list-rendered" );	
			}
		} );

		return {
			"restrict": "EA",
			"scope": true,
			"link": function onLink( scope, element, attributeSet ){
				PageFlow( scope, element, "report-list" );

				scope.hidePage( );

				scope.$on( "show-report-list",
					function onShowReportList( ){
						scope.showPage( );
					} );

				scope.$on( "hide-report-list",
					function onHideReportList( ){
						scope.hidePage( );
					} );

				React.renderComponent( <reportList scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );