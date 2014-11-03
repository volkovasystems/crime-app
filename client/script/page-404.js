angular.module( "page404", [ "PageFlow", "Event" ] )
	.directive( "page404", [
		"PageFlow",
		"Event",
		function directive( PageFlow, Event ){
			return {
				"restrict": "EA",
				"scope": true,
				"link": function onLink( scope, element, attribute ){

				}
			};
		}
	] );