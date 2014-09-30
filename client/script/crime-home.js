Crime.directive( "crimeHome", [
	function directive( ){

		return {
			"restrict": "EA",
			"template": "<div>Hello World</div>",
			"link": function onLink( scope, element, attributeSet ){

			}
		};
	}
] );
