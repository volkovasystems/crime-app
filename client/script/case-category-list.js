angular.module( "CaseCategoryList", [ "Event", "PageFlow" ] )
	
	.constant( "CHOOSE_CATEGORY_PHRASE", labelData.CHOOSE_CATEGORY_PHRASE )

	.constant( "MORE_CATEGORY_LABEL", labelData.MORE_CATEGORY_LABEL )

	.constant( "LESS_CATEGORY_LABEL", labelData.LESS_CATEGORY_LABEL )

	.factory( "CaseCategoryList", [
		"CHOOSE_CATEGORY_PHRASE",
		"MORE_CATEGORY_LABEL",		
		"LESS_CATEGORY_LABEL",
		function factory(
			CHOOSE_CATEGORY_PHRASE,
			MORE_CATEGORY_LABEL,
			LESS_CATEGORY_LABEL
		){
			var CaseCategoryList = React.createClass( {
				"statics": {
					"attach": function attach( scope, container, optionSet ){
						var caseCategoryListComponent = (
							<CaseCategoryList 
								scope={ scope }
								container={ container }
								onSelectCaseCategory={ optionSet.onSelectCaseCategory } />
						);

						React.render( caseCategoryListComponent, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"selectedCaseCategory": [ ],
						"caseCategoryList": [ ],
						"viewableCategoryList": [ ],
						"isMoreCategory": true,
						"isLessCategory": false
					};
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"onSelectCaseCategory": function onSelectCaseCategory( ){ }
					};
				},

				"onClickMoreCategory": function onClickMoreCategory( ){
					var caseCategoryList = this.state.caseCategoryList;

					this.setState( {
						"viewableCategoryList": _.clone( caseCategoryList ),
						"isMoreCategory": false,
						"isLessCategory": true
					} );
				},

				"onClickLessCategory": function onClickLessCategory( ){
					var caseCategoryList = this.state.caseCategoryList;
					
					this.setState( {
						"viewableCategoryList": _.first( caseCategoryList, staticData.LESS_CATEGORY_LIST_COUNT ),
						"isMoreCategory": true,
						"isLessCategory": false
					} );
				},

				"onSelectCaseCategory": function onSelectCaseCategory( event ){
					var selectedCaseCategory = $( event.currentTarget ).attr( "value" );

					var selectedCaseCategoryList = _.clone( this.state.selectedCaseCategory );

					if( _.contains( selectedCaseCategoryList, selectedCaseCategory ) ){
						this.setState( {
							"selectedCaseCategory": _.without( selectedCaseCategoryList, selectedCaseCategory )
						} );

					}else{
						selectedCaseCategoryList.push( selectedCaseCategory );

						this.setState( {
							"selectedCaseCategory": selectedCaseCategoryList
						} );
					}
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "set-case-category-list",
						function onSetCaseCategoryList( caseCategoryList ){
							self.setState( {
								"caseCategoryList": caseCategoryList,
								"viewableCategoryList": _.first( caseCategoryList, staticData.LESS_CATEGORY_LIST_COUNT )
							} );
						} );

					this.scope.on( "get-case-category-list",
						function onGetCaseCategoryList( callback ){
							callback( null, self.state.caseCategoryList );
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"componentWillUpdate": function componentWillUpdate( nextProps, nextState ){

				},

				"onEachCaseCategoryItem": function onEachCaseCategoryItem( caseCategoryData ){
					var hashedValue = btoa( JSON.stringify( caseCategoryData ) ).replace( /[^A-Za-z0-9]/g, "" );

					var selectedCaseCategory = this.state.selectedCaseCategory;

					var caseCategoryName = caseCategoryData.name;

					var caseCategoryTitle = caseCategoryData.title;

					var uri = new URI( );
					var currentHostAddress = [ 
						"http:/",
						uri.host( )
					].join( "/" );

					var caseCategoryIconSource = [ 
						currentHostAddress, 
						"image", 
						[ caseCategoryName, "icon.png" ].join( "-" ) 
					].join( "/" );
					
					var isSelected = _.contains( selectedCaseCategory, caseCategoryName );

					return; //: @template: template/case-category-item.html
				},

				"render": function onRender( ){
					var viewableCategoryList = this.state.viewableCategoryList;

					var selectedCaseCategory = this.state.selectedCaseCategory;

					var isLessCategory = this.state.isLessCategory;

					var isMoreCategory = this.state.isMoreCategory;

					return; //: @template: template/case-category-list.html
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					if( !_.isEqual( prevState.selectedCaseCategory, this.state.selectedCaseCategory ) ){
						this.props.onSelectCaseCategory( this.state.selectedCaseCategory );
					}
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.publish( "case-category-list-rendered" );	
				}
			} );

			return CaseCategoryList;
		}
	] )

	.factory( "attachCaseCategoryList", [
		"$rootScope",
		"Event",
		"PageFlow",
		"CaseCategoryList",
		function factory(
			$rootScope,
			Event,
			PageFlow,
			CaseCategoryList
		){
			var attachCaseCategoryList = function attachCaseCategoryList( optionSet ){
				var element = optionSet.element;

				if( _.isEmpty( element ) || element.length == 0 ){
					throw new Error( "unable to attach component" );
				}

				var scope = optionSet.scope || $rootScope;

				if( optionSet.embedState != "no-embed" ){
					scope = scope.$new( true );
				}

				Event( scope );

				var pageFlow = PageFlow( scope, element, "case-category-list overflow" );

				if( optionSet.embedState != "no-embed" ){
					pageFlow.namespaceList = _.without( pageFlow.namespaceList, "page" );
				}

				scope.on( "show-case-category-list",
					function onShowCaseCategoryList( namespace ){
						if( optionSet.namespace == namespace ){
							scope.showPage( );	
						}
					} );

				scope.on( "hide-case-category-list",
					function onHideCaseCategoryList( namespace ){
						if( optionSet.namespace == namespace ){
							scope.hidePage( );
						}
					} );

				scope.publish( "hide-case-category-list", optionSet.namespace );

				CaseCategoryList.attach( scope, element, {
					"onSelectCaseCategory": optionSet.onSelectCaseCategory
				} );
			};

			return attachCaseCategoryList;
		}
	] )

	.directive( "caseCategoryList", [
		"attachCaseCategoryList",
		function directive( attachCaseCategoryList ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, element, attributeSet ){
					attachCaseCategoryList( {
						"scope": scope,
						"element": element,
						"attributeSet": attributeSet,
						"embedState": "no-embed"
					} );
				}
			};
		}
	] );