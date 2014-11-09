angular.module( "CaseCategoryList", [ "Event", "PageFlow", "Icon" ] )
	
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