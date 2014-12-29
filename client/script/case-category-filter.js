angular

	.module( "CaseCategoryFilter", [ "Event", "PageFlow", "CaseCategoryList" ] )
	
	.constant( "CASE_CATEGORY_FILTER_HEADER_LABEL", labelData.CASE_CATEGORY_FILTER_HEADER_LABEL )

	.constant( "CONFIRM_BUTTON_LABEL", labelData.CONFIRM_BUTTON_LABEL )

	.constant( "CANCEL_BUTTON_LABEL", labelData.CANCEL_BUTTON_LABEL )

	.factory( "CaseCategoryFilter", [
		"attachCaseCategoryList",
		"CASE_CATEGORY_FILTER_HEADER_LABEL",
		"CONFIRM_BUTTON_LABEL",
		"CANCEL_BUTTON_LABEL",
		function factory(
			attachCaseCategoryList,
			CASE_CATEGORY_FILTER_HEADER_LABEL,
			CONFIRM_BUTTON_LABEL,
			CANCEL_BUTTON_LABEL
		){
			var CaseCategoryFilter = React.createClass( {
				"statics": {
					"attach": function attach( scope, container, optionSet ){
						var caseCategoryFilterComponent = (
							<CaseCategoryFilter 
								scope={ scope }
								container={ container } />
						);

						React.render( caseCategoryFilterComponent, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"selectedCaseCategory": [ ],
						"componentState": "case-category-filter-minified"
					};
				},

				"onClickConfirm": function onClickConfirm( ){
					this.scope.publish( "filter-by-case-category", this.state.selectedCaseCategory );
				},

				"onClickCancel": function onClickCancel( ){
					this.setState( {
						"componentState": "case-category-filter-minified"
					} );
					
					this.scope.publish( "close-case-category-filter" );
				},

				"onClickOpenCaseCategoryFilter": function onClickOpenCaseCategoryFilter( ){
					this.setState( {
						"componentState": "case-category-filter-expanded"
					} );

					this.scope.publish( "open-case-category-filter" );
				},

				"onClickCloseCaseCategoryFilter": function onClickCloseCaseCategoryFilter( ){
					this.setState( {
						"componentState": "case-category-filter-minified"
					} );

					this.scope.publish( "close-case-category-filter" );
				},

				"onSelectCaseCategory": function onSelectCaseCategory( selectedCaseCategory ){
					selectedCaseCategory = _.last( selectedCaseCategory );

					this.setState( {
						"selectedCaseCategory": selectedCaseCategory
					} );

					this.scope.publish( "set-selected-case-category", 
						selectedCaseCategory, "case-category-filter" );
				},
				
				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "show-case-category-filter",
						function onShowCaseCategoryFilter( ){
							self.scope.publish( "show-case-category-list", "case-category-filter" );
						} );

					this.scope.on( "hide-case-category-filter",
						function onHideCaseCategoryFilter( ){
							self.scope.publish( "hide-case-category-list", "case-category-filter" );
						} );

					this.scope.on( "clear-case-category-filter-data",
						function onClearReportSpecifyCategoryData( ){
							self.setState( {
								"selectedCaseCategory": [ ] 
							} );

							self.scope.publish( "clear-selected-case-category", "case-category-filter" );
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"componentWillUpdate": function componentWillUpdate( nextProps, nextState ){

				},

				"render": function onRender( ){
					var componentState = this.state.componentState;

					return; //: @template: template/case-category-filter.html
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					
				},

				"componentDidMount": function componentDidMount( ){
					attachCaseCategoryList( {
						"scope": this.scope,
						"element": $( ".case-category-list", this.getDOMNode( ) ),
						"onSelectCaseCategory": this.onSelectCaseCategory,
						"namespace": "case-category-filter"
					} );

					this.scope.publish( "case-category-filter-rendered" );	
				}
			} );

			return CaseCategoryFilter;
		}
	] )

	.factory( "attachCaseCategoryFilter", [
		"$rootScope",
		"Event",
		"PageFlow",
		"CaseCategoryFilter",
		function factory(
			$rootScope,
			Event,
			PageFlow,
			CaseCategoryFilter
		){
			var attachCaseCategoryFilter = function attachCaseCategoryFilter( optionSet ){
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

				var pageFlow = PageFlow( scope, element, "case-category-filter overflow" );

				if( optionSet.embedState != "no-embed" ){
					pageFlow.namespaceList = _.without( pageFlow.namespaceList, "page" );
				}

				scope.on( "show-case-category-filter",
					function onShowCaseCategoryFilter( ){
						scope.showPage( );
					} );

				scope.on( "hide-case-category-filter",
					function onHideCaseCategoryFilter( ){
						scope.hidePage( );
					} );

				scope.publish( "hide-case-category-filter" );

				CaseCategoryFilter.attach( scope, element );
			};

			return attachCaseCategoryFilter;
		}
	] )

	.directive( "caseCategoryFilter", [
		"attachCaseCategoryFilter",
		function directive( attachCaseCategoryFilter ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, element, attributeSet ){
					attachCaseCategoryFilter( {
						"scope": scope,
						"element": element,
						"attributeSet": attributeSet,
						"embedState": "no-embed",
						"namespace": "case-category-filter"
					} );
				}
			};
		}
	] );