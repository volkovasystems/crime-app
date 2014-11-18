angular
	.module( "CaseCategory", [ 
		"Event", 
		"PageFlow", 
		"Icon", 
		"NameInput",
		"TitleInput", 
		"DescriptionInput"
	] )
	
	.value( "CASE_CATEGORY_HEADER_LABEL", "add a case category" )

	.factory( "CaseCategory", [
		"Icon",
		"NameInput",
		"TitleInput",
		"DescriptionInput",
		"CASE_CATEGORY_HEADER_LABEL",
		function factory( 
			Icon, 
			NameInput,
			TitleInput, 
			DescriptionInput, 
			CASE_CATEGORY_HEADER_LABEL
		){
			var CaseCategory = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						var caseCategoryComponent = <CaseCategory
							scope={ scope }/>

						React.render( caseCategoryComponent, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"name": "",
						"title": "",
						"description": "",
						"caseCategoryState": "case-category-empty",
						"componentState": "case-category-normal"
					};
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					var name = this.state.name;

					var title = this.state.title;

					var description = this.state.description;

					return ( 
						<div 
							className={ [
								"case-category-container",
							].join( " " ) }>
							<div 
								className={ [
									"case-category-component",
								].join( " " ) }>

								<div 
									className={ [
										"case-category-header"
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
											{ CASE_CATEGORY_HEADER_LABEL.toUpperCase( ) }
										</span>
									</div>
								</div>

								<div
									className={ [
										"case-category-body"
									].join( " " ) }>

									<div
										className={ [
											"case-category-form"
										].join( " " ) }>

										<NameInput 
											parent={ this }
											title="case category name"
											titleName="name"
											nameInput={ name } />

										<TitleInput 
											parent={ this }
											title="case category title"
											titleName="title"
											titleInput={ title } />

										<DescriptionInput 
											parent={ this }
											title="case category description"
											titleName="description"
											descriptionInput={ description } />
									</div>
								</div>
							</div>
						</div>
					);
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.publish( "case-category-rendered" );
				}
			} );

			return CaseCategory;
		}
	] )
	
	.directive( "caseCategory", [
		"Event",
		"PageFlow",
		"CaseCategory",
		function directive( Event, PageFlow, CaseCategory ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "report" );

					scope.on( "show-case-category",
						function onShowCaseCategory( ){
							scope.showPage( );
						} );

					scope.on( "hide-case-category",
						function onHideCaseCategory( ){
							scope.hidePage( );
						} );

					scope.publish( "hide-case-category" );

					CaseCategory
						.attach( scope, element );
				}
			};
		}
	] );