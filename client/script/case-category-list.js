angular.module( "CaseCategoryList", [ "Event", "PageFlow", "Icon", "ThumbnailList" ] )
	
	.value( "CASE_CATEGORY_LIST_HEADER_LABEL", "select a category" )

	.factory( "CaseCategoryList", [
		"Icon",
		"ThumbnailList",
		"CASE_CATEGORY_LIST_HEADER_LABEL",
		function factory( Icon, ThumbnailList, CASE_CATEGORY_LIST_HEADER_LABEL ){
			var CaseCategoryList = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						var caseCategoryListComponent = (
							<CaseCategoryList 
								scope={ scope }
								container={ container } />
						);

						React.render( caseCategoryListComponent, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"selectedCaseCategory": [ ],
						"caseCategoryList": [ ]
					};
				},

				"onClickCloseCaseCategoryListButton": function onClickCloseCaseCategoryListButton( ){
					this.scope.publish( "hide-case-category-list" );
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "set-case-category-list",
						function onSetCaseCategoryList( caseCategoryList ){
							self.setState( {
								"caseCategoryList": caseCategoryList
							} );
						} );

					this.scope.on( "set-selected-case-category",
						function onSetSelectedCaseCategory( selectedCaseCategory ){
							self.setState( {
								"selectedCaseCategory": selectedCaseCategory
							} );
						} );

					this.scope.on( "clear-selected-case-category",
						function onClearSelectedCaseCategory( ){
							self.setState( {
								"selectedCaseCategory": [ ]
							} );
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"componentWillUpdate": function componentWillUpdate( nextProps, nextState ){

				},

				"render": function onRender( ){
					var caseCategoryList = this.state.caseCategoryList;

					var selectedCaseCategory = this.state.selectedCaseCategory;

					return (
						<div
							className={ [
								"case-category-list-container"
							].join( " " ) }>
							<div
								className={ [
									"case-category-list-component"
								].join( " " ) }>
								<div 
									className={ [
										"case-category-list-header"
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
											{ CASE_CATEGORY_LIST_HEADER_LABEL.toUpperCase( ) }
										</span>
									</div>

									<div 
										className={ [
											"close-case-category-list-button",
											"shown",
											"inline-block"
										].join( " " ) }
										onClick={ this.onClickCloseCaseCategoryListButton }>
										<a 
											className={ [
												"action-element"
											].join( " " ) }
											href={ [
												"#",
												"close-case-category-list"
											].join( "/" ) }
											style={
												{
													"display": "block"
												}
											}>
											
											<Icon
												className={ [
													"close-case-category-list-icon"
												].join( " " ) }
												name="ic_close_24px" />
										</a>
									</div>
								</div>

								<div
									className={ [
										"case-category-list-body"
									].join( " " ) }>

									<div
										className={ [
											"list-selection"
										].join( " " ) }>

										<ThumbnailList 
											parent={ this }
											titleName="selectedCaseCategory"
											thumbnailList={ caseCategoryList }
											selectedThumbnailList={ selectedCaseCategory } />

									</div>
								</div>
							</div>	
						</div>
					)
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					if( !_.isEqual( prevState.selectedCaseCategory, this.state.selectedCaseCategory ) ){
						this.scope.publish( "selected-case-category-changed", this.state.selectedCaseCategory );
					}
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.broadcast( "case-category-list-rendered" );	
				}
			} );

			return CaseCategoryList;
		}
	] )

	.directive( "caseCategoryList", [
		"Event",
		"PageFlow",
		"CaseCategoryList",
		function directive( Event, PageFlow, CaseCategoryList ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "case-category-list" );

					scope.on( "show-case-category-list",
						function onShowCaseCategoryList( ){
							scope.showPage( );
						} );

					scope.on( "hide-case-category-list",
						function onHideCaseCategoryList( ){
							scope.hidePage( );
						} );

					scope.publish( "hide-case-category-list" );

					CaseCategoryList
						.attach( scope, element );
				}
			};
		}
	] );