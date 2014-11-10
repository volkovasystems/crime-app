angular.module( "CaseCategoryList", [ "Event", "PageFlow", "Icon" ] )
	
	.value( "CASE_CATEGORY_LIST_HEADER_LABEL", "select a category" )

	.factory( "CaseCategoryList", [
		"Icon",
		function factory( Icon ){
			var CaseCategoryList = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						var caseCategoryListComponent = (
							<CaseCategoryList
								scope={ scope } />
						);

						React.render( caseCategoryListComponent, container[ 0 ] );

						return this;
					}
				},

				"componentWillMount": function componentWillMount( ){

				},

				"componentWillUpdate": function componentWillUpdate( nextProps, nextState ){

				},

				"render": function onRender( ){
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
								</div>
							</div>	
						</div>
					)
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){

				},

				"componentDidMount": function componentDidMount( ){

				}
			} )
		}
	] )

	.directive( "caseCategoryList", [
		"Event",
		"PageFlow",
		function directive( Event, PageFlow ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope );


				}
			};
		}
	] );