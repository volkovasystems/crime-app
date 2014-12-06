angular.module( "CaseCategoryFilter", [ "Event", "PageFlow", "CaseCategoryList" ] )
	
	.constant( "CHOOSE_CATEGORY_PHRASE", labelData.CHOOSE_CATEGORY_PHRASE )

	.constant( "MORE_CATEGORY_LABEL", labelData.MORE_CATEGORY_LABEL )

	.constant( "LESS_CATEGORY_LABEL", labelData.LESS_CATEGORY_LABEL )

	.factory( "CaseCategoryFilter", [
		"CHOOSE_CATEGORY_PHRASE",
		"MORE_CATEGORY_LABEL",		
		"LESS_CATEGORY_LABEL",
		function factory(
			CHOOSE_CATEGORY_PHRASE,
			MORE_CATEGORY_LABEL,
			LESS_CATEGORY_LABEL
		){
			var CaseCategoryFilter = React.createClass( {
				"statics": {
					"attach": function attach( scope, container, optionSet ){
						var caseCategoryListComponent = (
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
					};
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
					};
				},

				"onSelectCaseCategory": function onSelectCaseCategory( selectedCaseCategory ){
					this.setState( {
						"selectedCaseCategory": _.last( selectedCaseCategory )
					} );
				},
				
				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"componentWillUpdate": function componentWillUpdate( nextProps, nextState ){

				},

				"render": function onRender( ){
					return; //: @template: template/case-category-filter.html
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.publish( "case-category-filter-rendered" );	
				}
			} );

			return CaseCategoryList;
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

				Event( scope );

				var pageFlow = PageFlow( scope, element, "case-category-filter overflow" );

				if( optionSet.embedState != "no-embed" ){
					pageFlow.namespaceList = _.without( pageFlow.namespaceList, "page" );
				}

				scope.on( "show-case-category-filter",
					function onShowCaseCategoryFilter( namespace ){
						if( optionSet.namespace == namespace ){
							scope.showPage( );	
						}
					} );

				scope.on( "hide-case-category-filter",
					function onHideCaseCategoryFilter( namespace ){
						if( optionSet.namespace == namespace ){
							scope.hidePage( );
						}
					} );

				scope.publish( "hide-case-category-filter", optionSet.namespace );

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
						"embedState": "no-embed"
					} );
				}
			};
		}
	] );